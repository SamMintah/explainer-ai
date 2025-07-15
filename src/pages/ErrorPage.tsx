import { X, RefreshCw } from 'lucide-react';

type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error';

interface ErrorPageProps {
  errorType: 'url' | 'file' | 'generation' | 'network';
  setCurrentPage: (page: Page) => void;
  handleRetry: () => void;
}

export const ErrorPage = ({ errorType, setCurrentPage, handleRetry }: ErrorPageProps) => {
  const errorMessages = {
    url: {
      title: 'Unable to Access URL',
      message: 'We couldn\'t fetch content from the provided URL. This might be due to access restrictions or the page being unavailable.',
      suggestions: [
        'Check if the URL is correct and accessible',
        'Try a different article or webpage',
        'Upload the content as a file instead'
      ]
    },
    file: {
      title: 'File Processing Error',
      message: 'There was an issue processing your uploaded file. The file might be too large, corrupted, or in an unsupported format.',
      suggestions: [
        'Ensure file is under 10MB',
        'Use supported formats: PDF, DOCX, TXT',
        'Try converting to a different format'
      ]
    },
    generation: {
      title: 'Video Generation Failed',
      message: 'We encountered an issue while generating your explainer video. This could be due to complex content or temporary service issues.',
      suggestions: [
        'Try with shorter or simpler content',
        'Check your internet connection',
        'Wait a moment and try again'
      ]
    },
    network: {
      title: 'Connection Error',
      message: 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.',
      suggestions: [
        'Check your internet connection',
        'Try refreshing the page',
        'Wait a moment and retry'
      ]
    }
  };

  const currentError = errorMessages[errorType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentError.title}</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">{currentError.message}</p>
          
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-slate-900 mb-2">Try these solutions:</h3>
            <ul className="space-y-1">
              {currentError.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-slate-600 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleRetry}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <button 
              onClick={() => setCurrentPage('home')}
              className="flex-1 bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Go Home</span>
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Still having issues? <button className="text-purple-600 hover:text-purple-700 font-medium">Contact Support</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};