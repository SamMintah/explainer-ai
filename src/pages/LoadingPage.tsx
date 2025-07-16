
import React from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';

interface LoadingPageProps {
  loadingStep: number;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ loadingStep }) => {
  const steps = [
    'Analyzing content...',
    'Generating script...',
    'Creating visuals...',
    'Rendering video...'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Creating Your Explainer</h2>
          <p className="text-slate-600 mb-8">This will just take a moment...</p>
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  index < loadingStep 
                    ? 'bg-green-500' 
                    : index === loadingStep 
                      ? 'bg-purple-500' 
                      : 'bg-slate-200'
                }`}>
                  {index < loadingStep && <CheckCircle className="w-3 h-3 text-white" />}
                  {index === loadingStep && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                </div>
                <span className={`text-sm ${
                  index <= loadingStep ? 'text-slate-900 font-medium' : 'text-slate-500'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(loadingStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;
