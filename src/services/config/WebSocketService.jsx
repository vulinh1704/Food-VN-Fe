import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Polyfill for global
if (typeof global === 'undefined') {
    window.global = window;
}

const SOCKET_URL = 'http://localhost:8080/ws-notification';

class WebSocketService {
    client;
    static instance;
    messageHandlers = [];
    isConnected = false;

    constructor() {
        const token = localStorage.getItem('accessToken');
        console.log("token", token);

        // Tạo socket với options
        const socket = new SockJS(SOCKET_URL, null, {
            transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Authorization': `Bearer ${token}`
            }
        });

        socket.withCredentials = true;

        // Log các events của SockJS để debug
        socket.onopen = () => {
            console.log('SockJS connection opened');
        };

        socket.onclose = (event) => {
            console.log('SockJS connection closed', event);
        };

        socket.onerror = (error) => {
            console.error('SockJS error:', error);
        };

        this.client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                'Authorization': `Bearer ${token}`,
                'X-Authorization': `Bearer ${token}`
            },
            beforeConnect: () => {
                if (this.client.stompClient) {
                    this.client.stompClient.connectHeaders = {
                        'Authorization': `Bearer ${token}`,
                        'X-Authorization': `Bearer ${token}`,
                        'heart-beat': '0,0'  
                    };
                }
            },
            debug: (str) => {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 0,  // Disable heartbeat
            heartbeatOutgoing: 0,  // Disable heartbeat
        });

        this.client.onConnect = () => {
            console.log('STOMP Connected');
            this.isConnected = true;
            this.subscribeToNotifications();
        };

        this.client.onDisconnect = () => {
            console.log('STOMP Disconnected');
            this.isConnected = false;
        };

        this.client.onStompError = (frame) => {
            console.error('STOMP error', frame);
        };

        this.client.onWebSocketError = (error) => {
            console.error('WebSocket error', error);
        };
    }

    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    connect() {
        if (!this.isConnected) {
            try {
                this.client.activate();
            } catch (error) {
                console.error('Connection error:', error);
            }
        }
    }

    disconnect() {
        if (this.isConnected) {
            try {
                this.client.deactivate();
            } catch (error) {
                console.error('Disconnection error:', error);
            }
        }
    }

    subscribeToNotifications() {
        try {
            this.client.subscribe('/topic/notifications/admin', (message) => {
                console.log('Raw message received:', message);
                console.log('Message body:', message.body);
                
                try {
                    const notification = JSON.parse(message.body);
                    console.log('Parsed notification:', notification);
                    
                    // Kiểm tra xem notification có đúng format không
                    if (notification && (notification.message || notification.content)) {
                        this.messageHandlers.forEach(handler => {
                            console.log('Calling handler with notification');
                            handler(notification);
                        });
                    } else {
                        console.warn('Invalid notification format:', notification);
                    }
                } catch (error) {
                    console.error('Error parsing notification:', error);
                    console.error('Raw message body:', message.body);
                }
            });
        } catch (error) {
            console.error('Subscription error:', error);
        }
    }

    addMessageHandler(handler) {
        if (!this.messageHandlers.includes(handler)) {
            this.messageHandlers.push(handler);
            console.log('Added message handler, total handlers:', this.messageHandlers.length);
        }
    }

    removeMessageHandler(handler) {
        const index = this.messageHandlers.indexOf(handler);
        if (index > -1) {
            this.messageHandlers.splice(index, 1);
            console.log('Removed message handler, remaining handlers:', this.messageHandlers.length);
        }
    }
}

export default WebSocketService; 