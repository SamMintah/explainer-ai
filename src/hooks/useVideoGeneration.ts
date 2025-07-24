import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// Types for the hook
export interface JobStatus {
  jobId: string;
  status: 'queued' | 'processing' | 'done' | 'error';
  videoUrl?: string;
  error?: string;
  progress?: {
    step: string;
    percentage: number;
  };
}

export interface GenerateVideoRequest {
  url: string;
  voice?: string;
  style?: string;
}

export interface GenerateVideoFileRequest {
  file: File;
  voice?: string;
  style?: string;
}

export interface GenerateVideoTextRequest {
  text: string;
  voice?: string;
  style?: string;
}

export interface GenerateVideoResponse {
  jobId: string;
}

export interface UseVideoGenerationReturn {
  // State
  jobId: string | null;
  status: JobStatus['status'] | null;
  progress: JobStatus['progress'] | null;
  videoUrl: string | null;
  error: string | null;
  isLoading: boolean;
  isPolling: boolean;
  isConnectedToWebSocket: boolean;

  // Actions
  generateVideo: (request: GenerateVideoRequest) => Promise<void>;
  generateVideoFromFile: (request: GenerateVideoFileRequest) => Promise<void>;
  generateVideoFromText: (request: GenerateVideoTextRequest) => Promise<void>;
  reset: () => void;
  stopPolling: () => void;
}

// API base URL - can be configured via environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Create headers with auth token
const createAuthHeaders = (additionalHeaders: Record<string, string> = {}): Record<string, string> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...additionalHeaders,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API utility functions
const generateVideoAPI = async (request: GenerateVideoRequest): Promise<GenerateVideoResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/video-job/generate-video`, {
    method: 'POST',
    headers: createAuthHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const generateVideoFromFileAPI = async (request: GenerateVideoFileRequest): Promise<GenerateVideoResponse> => {
  const formData = new FormData();
  formData.append('file', request.file);
  if (request.voice) formData.append('voice', request.voice);
  if (request.style) formData.append('style', request.style);

  const response = await fetch(`${API_BASE_URL}/api/video-job/generate-video/file`, {
    method: 'POST',
    headers: createAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const generateVideoFromTextAPI = async (request: GenerateVideoTextRequest): Promise<GenerateVideoResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/video-job/generate-video/text`, {
    method: 'POST',
    headers: createAuthHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const getJobStatusAPI = async (jobId: string): Promise<JobStatus> => {
  const response = await fetch(`${API_BASE_URL}/api/video-job/status/${jobId}`, {
    headers: createAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useVideoGeneration = (): UseVideoGenerationReturn => {
  // State management
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus['status'] | null>(null);
  const [progress, setProgress] = useState<JobStatus['progress'] | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [isConnectedToWebSocket, setIsConnectedToWebSocket] = useState(false);

  // Refs for cleanup
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsPolling(false);
    setIsConnectedToWebSocket(false);
  }, []);

  // WebSocket connection setup
  const setupWebSocket = useCallback((currentJobId: string) => {
    const token = getAuthToken();
    if (!token) {
      console.warn('No auth token available for WebSocket connection');
      return false;
    }

    try {
      const socket = io(API_BASE_URL, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Connected to WebSocket');
        setIsConnectedToWebSocket(true);
        // Join the job room for progress updates
        socket.emit('joinJob', currentJobId);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
        setIsConnectedToWebSocket(false);
      });

      socket.on('jobProgress', (data: JobStatus) => {
        if (data.jobId === currentJobId) {
          setStatus(data.status);
          setProgress(data.progress || null);
          
          if (data.status === 'done') {
            setVideoUrl(data.videoUrl || null);
            setIsLoading(false);
            cleanup();
          } else if (data.status === 'error') {
            setError(data.error || 'Video generation failed');
            setIsLoading(false);
            cleanup();
          }
        }
      });

      socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnectedToWebSocket(false);
        // Fallback to polling if WebSocket fails
        return false;
      });

      return true;
    } catch (error) {
      console.error('Failed to setup WebSocket:', error);
      return false;
    }
  }, [cleanup]);

  // Poll job status
  const pollJobStatus = useCallback(async (currentJobId: string) => {
    try {
      const jobStatus = await getJobStatusAPI(currentJobId);
      
      setStatus(jobStatus.status);
      setProgress(jobStatus.progress || null);
      
      if (jobStatus.status === 'done') {
        setVideoUrl(jobStatus.videoUrl || null);
        setIsLoading(false);
        cleanup();
      } else if (jobStatus.status === 'error') {
        setError(jobStatus.error || 'Video generation failed');
        setIsLoading(false);
        cleanup();
      }
      // Continue polling for 'queued' and 'processing' statuses
    } catch (err) {
      console.error('Error polling job status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check job status');
      setIsLoading(false);
      cleanup();
    }
  }, [cleanup]);

  // Start polling
  const startPolling = useCallback((currentJobId: string) => {
    setIsPolling(true);
    
    // Initial poll
    pollJobStatus(currentJobId);
    
    // Set up interval polling (every 2 seconds)
    pollingIntervalRef.current = setInterval(() => {
      pollJobStatus(currentJobId);
    }, 2000);
  }, [pollJobStatus]);

  // Start progress monitoring (WebSocket first, fallback to polling)
  const startProgressMonitoring = useCallback((currentJobId: string) => {
    // Try WebSocket first
    const webSocketConnected = setupWebSocket(currentJobId);
    
    // If WebSocket fails, fallback to polling
    if (!webSocketConnected) {
      console.log('WebSocket failed, falling back to polling');
      startPolling(currentJobId);
    }
  }, [setupWebSocket, startPolling]);

  // Generate video function
  const generateVideo = useCallback(async (request: GenerateVideoRequest) => {
    try {
      // Reset state
      setError(null);
      setVideoUrl(null);
      setProgress(null);
      setStatus(null);
      setIsLoading(true);
      
      // Clean up any existing polling/websocket
      cleanup();

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      // Call API to start video generation
      const response = await generateVideoAPI(request);
      
      // Store job ID and start progress monitoring
      setJobId(response.jobId);
      setStatus('queued');
      startProgressMonitoring(response.jobId);
      
    } catch (err) {
      console.error('Error generating video:', err);
      setError(err instanceof Error ? err.message : 'Failed to start video generation');
      setIsLoading(false);
      cleanup();
    }
  }, [cleanup, startProgressMonitoring]);

  // Generate video from file function
  const generateVideoFromFile = useCallback(async (request: GenerateVideoFileRequest) => {
    try {
      // Reset state
      setError(null);
      setVideoUrl(null);
      setProgress(null);
      setStatus(null);
      setIsLoading(true);
      
      // Clean up any existing polling/websocket
      cleanup();

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      // Call API to start video generation from file
      const response = await generateVideoFromFileAPI(request);
      
      // Store job ID and start progress monitoring
      setJobId(response.jobId);
      setStatus('queued');
      startProgressMonitoring(response.jobId);
      
    } catch (err) {
      console.error('Error generating video from file:', err);
      setError(err instanceof Error ? err.message : 'Failed to start video generation from file');
      setIsLoading(false);
      cleanup();
    }
  }, [cleanup, startProgressMonitoring]);

  // Generate video from text function
  const generateVideoFromText = useCallback(async (request: GenerateVideoTextRequest) => {
    try {
      // Reset state
      setError(null);
      setVideoUrl(null);
      setProgress(null);
      setStatus(null);
      setIsLoading(true);
      
      // Clean up any existing polling/websocket
      cleanup();

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      // Call API to start video generation from text
      const response = await generateVideoFromTextAPI(request);
      
      // Store job ID and start progress monitoring
      setJobId(response.jobId);
      setStatus('queued');
      startProgressMonitoring(response.jobId);
      
    } catch (err) {
      console.error('Error generating video from text:', err);
      setError(err instanceof Error ? err.message : 'Failed to start video generation from text');
      setIsLoading(false);
      cleanup();
    }
  }, [cleanup, startProgressMonitoring]);

  // Reset function
  const reset = useCallback(() => {
    cleanup();
    setJobId(null);
    setStatus(null);
    setProgress(null);
    setVideoUrl(null);
    setError(null);
    setIsLoading(false);
  }, [cleanup]);

  // Stop polling function
  const stopPolling = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Auto-cleanup on job completion or error
  useEffect(() => {
    if (status === 'done' || status === 'error') {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Small delay to show final status

      return () => clearTimeout(timer);
    }
  }, [status]);

  return {
    // State
    jobId,
    status,
    progress,
    videoUrl,
    error,
    isLoading,
    isPolling,
    isConnectedToWebSocket,

    // Actions
    generateVideo,
    generateVideoFromFile,
    generateVideoFromText,
    reset,
    stopPolling,
  };
};

export default useVideoGeneration;
