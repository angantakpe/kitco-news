import { useEffect, useRef, useState } from "react";

export const useWebSocket = (url: string, onMessage: (data: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected");
        return;
      }

      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log(`WebSocket connected to ${url}`);
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(`WebSocket received:`, data);
          onMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          console.log("Raw message:", event.data);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      socket.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
        
        // Only attempt to reconnect if it wasn't a normal closure
        if (event.code !== 1000) {
          console.log("Scheduling reconnection...");
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connect();
          }, 3000);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        // Use 1000 code for normal closure
        socketRef.current.close(1000, "Component unmounting");
      }
    };
  }, [url]);

  const sendMessage = (message: any) => {
    try {
      if (!socketRef.current) {
        throw new Error("WebSocket not initialized");
      }

      if (socketRef.current.readyState !== WebSocket.OPEN) {
        throw new Error(`WebSocket not open (state: ${socketRef.current.readyState})`);
      }

      console.log(`WebSocket sending:`, message);
      socketRef.current.send(JSON.stringify(message));
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
      throw error;
    }
  };

  return { sendMessage, isConnected };
};
