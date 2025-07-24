// API Request/Response Types for ExplainerAI Video Generation

export interface GenerateVideoRequest {
  url: string;
  voice?: string;
  style?: string;
}

export interface GenerateVideoResponse {
  jobId: string;
  message: string;
}

export enum JobStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  DONE = 'done',
  ERROR = 'error'
}

export interface JobStatusResponse {
  jobId: string;
  status: JobStatus;
  videoUrl?: string;
  error?: string;
  progress?: {
    currentStep: string;
    completedSteps: string[];
    totalSteps: number;
    percentage: number;
  };
}

// Additional utility types for better type safety
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface VideoGenerationProgress {
  step: 'fetching' | 'analyzing' | 'generating_script' | 'generating_audio' | 'rendering_video' | 'uploading';
  message: string;
  percentage: number;
}

// Voice options that can be passed to the API
export type VoiceOption = 
  | 'alloy'
  | 'echo' 
  | 'fable'
  | 'onyx'
  | 'nova'
  | 'shimmer'
  | string; // Allow custom voice IDs

// Style options for narration persona
export type NarrationStyle = 
  | 'professional'
  | 'casual'
  | 'educational'
  | 'enthusiastic'
  | 'calm'
  | string; // Allow custom styles