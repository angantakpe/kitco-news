import { useEffect, useRef, useState } from "react";

export const useWebSocket = (url: string, onMessage: (data: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [reconnectInterval, setReconnectInterval] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log(`Connected to WebSocket server`);
        if (reconnectInterval) clearInterval(reconnectInterval);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(`Received message: ${JSON.stringify(data, null, 2)}`);
        onMessage(data);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (reconnectInterval) clearInterval(reconnectInterval);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed.");
        // setReconnectInterval(setInterval(connectWebSocket, 5000));
      };
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectInterval) clearInterval(reconnectInterval);
    };
  }, [url, onMessage]);

  const sendMessage = (message: any) => {
    try {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        console.log(`Sending message: ${JSON.stringify(message, null, 2)}`);
        socketRef.current.send(JSON.stringify(message));
        console.log(`Sent message: ${JSON.stringify(message, null, 2)}`);
      } else {
        console.error("WebSocket connection is not open");
      }
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
    }
  };

  return { sendMessage };
};
