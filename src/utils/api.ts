// API configuration
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.VITE_API_URL || "https://api.explainer.ai"
    : "http://localhost:3001/api";

// Types for API requests and responses
export interface GenerateVideoRequest {
  url: string;
  voice?: string;
  style?: string;
}

export interface GenerateVideoResponse {
  jobId: string;
}

export enum JobStatus {
  QUEUED = "queued",
  PROCESSING = "processing",
  DONE = "done",
  ERROR = "error",
}

export interface JobStatusResponse {
  jobId: string;
  status: JobStatus;
  videoUrl?: string;
  error?: string;
  progress?: {
    step: string;
    percentage: number;
  };
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic API request function with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorCode = response.status.toString();

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorCode = errorData.code || errorCode;
      } catch {
        // If response is not JSON, use default error message
      }

      throw new ApiError(errorMessage, response.status, errorCode);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors, timeout, etc.
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError("Network error: Unable to connect to server");
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}

/**
 * Generate a video from a URL
 * @param url - The URL of the content to convert to video
 * @param voice - Optional voice selection for TTS
 * @param style - Optional narration style/persona
 * @returns Promise resolving to job ID
 */
export async function generateVideo(
  url: string,
  voice?: string,
  style?: string
): Promise<string> {
  if (!url || typeof url !== "string") {
    throw new ApiError("URL is required and must be a string");
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch {
    throw new ApiError("Invalid URL format");
  }

  const requestBody: GenerateVideoRequest = {
    url,
    ...(voice && { voice }),
    ...(style && { style }),
  };

  const response = await apiRequest<GenerateVideoResponse>("/video-job/generate-video", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  return response.jobId;
}

/**
 * Get the status of a video generation job
 * @param jobId - The job ID returned from generateVideo
 * @returns Promise resolving to job status information
 */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  if (!jobId || typeof jobId !== "string") {
    throw new ApiError("Job ID is required and must be a string");
  }

  return apiRequest<JobStatusResponse>(`/video-job/status/${encodeURIComponent(jobId)}`);
}

/**
 * Poll job status until completion or error
 * @param jobId - The job ID to poll
 * @param onProgress - Optional callback for progress updates
 * @param pollInterval - Polling interval in milliseconds (default: 2000)
 * @param timeout - Maximum time to poll in milliseconds (default: 300000 = 5 minutes)
 * @returns Promise resolving to final job status
 */
export async function pollJobStatus(
  jobId: string,
  onProgress?: (status: JobStatusResponse) => void,
  pollInterval: number = 2000,
  timeout: number = 300000
): Promise<JobStatusResponse> {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        // Check timeout
        if (Date.now() - startTime > timeout) {
          reject(new ApiError("Job polling timeout exceeded"));
          return;
        }

        const status = await getJobStatus(jobId);

        // Call progress callback if provided
        if (onProgress) {
          onProgress(status);
        }

        // Check if job is complete
        if (status.status === JobStatus.DONE) {
          resolve(status);
          return;
        }

        if (status.status === JobStatus.ERROR) {
          reject(new ApiError(status.error || "Job failed with unknown error"));
          return;
        }

        // Continue polling if job is still in progress
        if (
          status.status === JobStatus.QUEUED ||
          status.status === JobStatus.PROCESSING
        ) {
          setTimeout(poll, pollInterval);
          return;
        }

        // Unknown status
        reject(new ApiError(`Unknown job status: ${status.status}`));
      } catch (error) {
        reject(error);
      }
    };

    // Start polling
    poll();
  });
}

/**
 * Generate video and poll until completion
 * @param url - The URL of the content to convert to video
 * @param options - Optional configuration
 * @returns Promise resolving to final job status with video URL
 */
export async function generateVideoAndWait(
  url: string,
  options: {
    voice?: string;
    style?: string;
    onProgress?: (status: JobStatusResponse) => void;
    pollInterval?: number;
    timeout?: number;
  } = {}
): Promise<JobStatusResponse> {
  const { voice, style, onProgress, pollInterval, timeout } = options;

  // Start video generation
  const jobId = await generateVideo(url, voice, style);

  // Poll until completion
  return pollJobStatus(jobId, onProgress, pollInterval, timeout);
}

// Export types for use in other files
export type { GenerateVideoRequest, GenerateVideoResponse, JobStatusResponse };
