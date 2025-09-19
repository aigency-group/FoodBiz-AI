
import { useState, useEffect, useRef, useCallback } from 'react';

export enum ReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export interface WebSocketMessage {
  type: string;
  content?: string;
  response?: string;
  sources?: any[];
  payload?: any;
  detail?: string;
}

export const useWebSocket = (url: string | null) => {
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [readyState, setReadyState] = useState<ReadyState>(ReadyState.CLOSED);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (url) {
      ws.current = new WebSocket(url);
      setReadyState(ReadyState.CONNECTING);

      ws.current.onopen = () => {
        console.log('WebSocket Connected');
        setReadyState(ReadyState.OPEN);
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      };

      ws.current.onclose = () => {
        console.log('WebSocket Disconnected');
        setReadyState(ReadyState.CLOSED);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      return () => {
        ws.current?.close();
      };
    }
  }, [url]);

  const sendMessage = useCallback((message: string) => {
    if (ws.current && ws.current.readyState === ReadyState.OPEN) {
      ws.current.send(message);
    }
  }, []);

  return { lastMessage, readyState, sendMessage };
};
