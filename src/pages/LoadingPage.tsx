
import React from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface JobStatus {
  jobId: string;
  status: 'queued' | 'processing' | 'done' | 'error';
  videoUrl?: string;
  error?: string;
  progress?: {
    currentStep: string;
    stepIndex: number;
    totalSteps: number;
    message?: string;
  };
}

interface LoadingPageProps {
  jobStatus: JobStatus;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ jobStatus }) => {
  const steps = [
    { key: 'analyzing', label: 'Analyzing content...' },
    { key: 'generating', label: 'Generating script...' },
    { key: 'tts', label: 'Creating narration...' },
    { key: 'rendering', label: 'Rendering video...' },
    { key: 'uploading', label: 'Finalizing...' }
  ];

  // Determine current step based on job status and progress
  const getCurrentStepIndex = () => {
    if (jobStatus.status === 'queued') return -1;
    if (jobStatus.status === 'error') return -1;
    if (jobStatus.status === 'done') return steps.length;
    
    // If we have progress information, use it
    if (jobStatus.progress) {
      return jobStatus.progress.stepIndex;
    }
    
    // Fallback: determine step from status
    return 0;
  };

  const currentStepIndex = getCurrentStepIndex();
  
  // Get current step message
  const getCurrentMessage = () => {
    if (jobStatus.status === 'queued') return 'Queued for processing...';
    if (jobStatus.status === 'error') return jobStatus.error || 'An error occurred';
    if (jobStatus.status === 'done') return 'Video ready!';
    
    if (jobStatus.progress?.message) {
      return jobStatus.progress.message;
    }
    
    if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
      return steps[currentStepIndex].label;
    }
    
    return 'Processing...';
  };

  const isError = jobStatus.status === 'error';
  const isQueued = jobStatus.status === 'queued';
  const isDone = jobStatus.status === 'done';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isError 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : isDone 
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : 'bg-gradient-to-r from-purple-600 to-pink-600'
          }`}>
            {isError ? (
              <AlertCircle className="w-8 h-8 text-white" />
            ) : isDone ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <RefreshCw className={`w-8 h-8 text-white ${!isQueued ? 'animate-spin' : ''}`} />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isError ? 'Error Occurred' : isDone ? 'Video Ready!' : 'Creating Your Explainer'}
          </h2>
          <p className="text-slate-600 mb-8">
            {isError ? 'Something went wrong during processing' : isDone ? 'Your explainer video has been generated' : getCurrentMessage()}
          </p>
          
          {!isError && (
            <div className="space-y-4">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex && !isDone;
                const isActive = index <= currentStepIndex || isDone;
                
                return (
                  <div key={step.key} className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isCompleted || isDone
                        ? 'bg-green-500' 
                        : isCurrent 
                          ? 'bg-purple-500' 
                          : 'bg-slate-200'
                    }`}>
                      {(isCompleted || isDone) && <CheckCircle className="w-3 h-3 text-white" />}
                      {isCurrent && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                    </div>
                    <span className={`text-sm ${
                      isActive ? 'text-slate-900 font-medium' : 'text-slate-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          
          {!isError && (
            <div className="mt-8">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isDone 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600'
                  }`}
                  style={{ 
                    width: `${isDone ? 100 : Math.max(0, (currentStepIndex / steps.length) * 100)}%` 
                  }}
                />
              </div>
              {jobStatus.progress && (
                <div className="mt-2 text-xs text-slate-500">
                  Step {Math.max(1, currentStepIndex + 1)} of {steps.length}
                </div>
              )}
            </div>
          )}

          {isError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                {jobStatus.error || 'An unexpected error occurred while processing your video.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;
