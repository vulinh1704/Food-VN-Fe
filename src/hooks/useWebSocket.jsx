import { useEffect } from 'react';
import WebSocketService from '../services/config/WebSocketService';

export const useWebSocket = (onMessage, topic) => {
    useEffect(() => {
        const webSocketService = WebSocketService.getInstance();
        webSocketService.addMessageHandler(onMessage);
        if (topic) {
            webSocketService.subscribeToNotifications(topic);
        }
        webSocketService.connect();
        return () => {
            webSocketService.removeMessageHandler(onMessage);
        };
    }, [onMessage, topic]);
}; 