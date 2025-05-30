import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Polyfill for global
if (typeof global === 'undefined') {
    window.global = window;
}

const API_URL = 'http://localhost:8080';

class WebSocketService {
    client;
    static instance;
    messageHandlers = [];
    isConnected = false;

    constructor() {
        this.client = new Client({
            brokerURL: 'ws://localhost:8080/ws-notification',
            debug: (str) => {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
            console.log('Connected to WebSocket');
            this.isConnected = true;
            this.subscribeToNotifications();
        };

        this.client.onDisconnect = () => {
            console.log('Disconnected from WebSocket');
            this.isConnected = false;
        };

        this.client.onStompError = (frame) => {
            console.error('STOMP error', frame);
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
            this.client.activate();
        }
    }

    disconnect() {
        if (this.isConnected) {
            this.client.deactivate();
        }
    }

    subscribeToNotifications() {
        this.client.subscribe('/topic/notifications/admin', (message) => {
            try {
                const notification = JSON.parse(message.body);
                this.messageHandlers.forEach(handler => handler(notification));
            } catch (error) {
                console.error('Error parsing notification:', error);
            }
        });
    }

    addMessageHandler(handler) {
        if (!this.messageHandlers.includes(handler)) {
            this.messageHandlers.push(handler);
        }
    }

    removeMessageHandler(handler) {
        const index = this.messageHandlers.indexOf(handler);
        if (index > -1) {
            this.messageHandlers.splice(index, 1);
        }
    }
}

export default WebSocketService; 