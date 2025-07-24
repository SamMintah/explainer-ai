import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface JobProgress {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  stage: string;
  message?: string;
  error?: string;
}

interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  subscribeToJob: (jobId: string) => void;
  unsubscribeFromJob: (jobId: string) => void;
  onJobProgress: (callback: (progress: JobProgress) => void) => () => void;
  onJobComplete: (callback: (result: any) => void) => () => void;
  onJobError: (callback: (error: string) => void) => () => void;
}

const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:3001';

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    autoConnect = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const subscribedJobsRef = useRef<Set<string>>(new Set());

  // Get authentication token
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('authToken');
  }, []);

  // Create socket connection
  const createSocket = useCallback(() => {
    const token = getAuthToken();
    
    const socket = io(WEBSOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true,
    });

    return socket;
  }, [getAuthToken]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const socket = createSocket();
      socketRef.current = socket;

      // Connection successful
      socket.on('connect', () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Re-subscribe to any jobs that were previously subscribed
        subscribedJobsRef.current.forEach(jobId => {
          socket.emit('subscribe-job', { jobId });
        });
      });

      // Connection error
      socket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err);
        setIsConnected(false);
        setIsConnecting(false);
        setError(`Connection failed: ${err.message}`);
        
        // Attempt reconnection
        if (reconnectAttemptsRef.current < reconnectionAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnection attempt ${reconnectAttemptsRef.current}/${reconnectionAttempts}`);
            connect();
          }, reconnectionDelay * reconnectAttemptsRef.current);
        } else {
          setError('Failed to connect after multiple attempts');
        }
      });

      // Disconnection
      socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
        setIsConnected(false);
        setIsConnecting(false);

        // Auto-reconnect unless disconnection was intentional
        if (reason !== 'io client disconnect' && reconnectAttemptsRef.current < reconnectionAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Auto-reconnection attempt ${reconnectAttemptsRef.current}/${reconnectionAttempts}`);
            connect();
          }, reconnectionDelay * reconnectAttemptsRef.current);
        }
      });

      // Authentication error
      socket.on('auth-error', (error) => {
        console.error('WebSocket authentication error:', error);
        setError(`Authentication failed: ${error.message}`);
        disconnect();
      });

      // General error handling
      socket.on('error', (error) => {
        console.error('WebSocket error:', error);
        setError(`Socket error: ${error.message || error}`);
      });

    } catch (err) {
      console.error('Failed to create socket:', err);
      setIsConnecting(false);
      setError(`Failed to create connection: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [createSocket, reconnectionAttempts, reconnectionDelay]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setError(null);
    reconnectAttemptsRef.current = 0;
    subscribedJobsRef.current.clear();
  }, []);

  // Subscribe to job progress updates
  const subscribeToJob = useCallback((jobId: string) => {
    if (!socketRef.current?.connected) {
      console.warn('Cannot subscribe to job: WebSocket not connected');
      return;
    }

    subscribedJobsRef.current.add(jobId);
    socketRef.current.emit('subscribe-job', { jobId });
    console.log(`Subscribed to job: ${jobId}`);
  }, []);

  // Unsubscribe from job progress updates
  const unsubscribeFromJob = useCallback((jobId: string) => {
    if (!socketRef.current?.connected) {
      return;
    }

    subscribedJobsRef.current.delete(jobId);
    socketRef.current.emit('unsubscribe-job', { jobId });
    console.log(`Unsubscribed from job: ${jobId}`);
  }, []);

  // Listen for job progress updates
  const onJobProgress = useCallback((callback: (progress: JobProgress) => void) => {
    if (!socketRef.current) {
      return () => {};
    }

    const handleProgress = (data: JobProgress) => {
      callback(data);
    };

    socketRef.current.on('job-progress', handleProgress);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('job-progress', handleProgress);
      }
    };
  }, []);

  // Listen for job completion
  const onJobComplete = useCallback((callback: (result: any) => void) => {
    if (!socketRef.current) {
      return () => {};
    }

    const handleComplete = (data: any) => {
      callback(data);
    };

    socketRef.current.on('job-complete', handleComplete);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('job-complete', handleComplete);
      }
    };
  }, []);

  // Listen for job errors
  const onJobError = useCallback((callback: (error: string) => void) => {
    if (!socketRef.current) {
      return () => {};
    }

    const handleError = (data: { error: string }) => {
      callback(data.error);
    };

    socketRef.current.on('job-error', handleError);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('job-error', handleError);
      }
    };
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Handle token changes (re-authenticate if token changes)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && socketRef.current?.connected) {
        // Token changed, reconnect with new token
        disconnect();
        setTimeout(() => connect(), 100);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    subscribeToJob,
    unsubscribeFromJob,
    onJobProgress,
    onJobComplete,
    onJobError,
  };
};

export default useWebSocket;