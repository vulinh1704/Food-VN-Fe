import { useEffect } from 'react';
import WebSocketService from '../services/config/WebSocketService';
export const useWebSocket = (onMessage) => {
    useEffect(() => {
        const webSocketService = WebSocketService.getInstance();
        webSocketService.addMessageHandler(onMessage);
        webSocketService.connect();
        return () => {
            webSocketService.removeMessageHandler(onMessage);
        };
    }, [onMessage]);
}; 