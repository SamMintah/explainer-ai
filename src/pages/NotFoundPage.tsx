type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error';

interface NotFoundPageProps {
  setCurrentPage: (page: Page) => void;
}

export const NotFoundPage = ({ setCurrentPage }: NotFoundPageProps) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
    <div className="text-center max-w-md mx-4">
      <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <span className="text-4xl font-bold text-white">404</span>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h1>
      <p className="text-slate-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button 
        onClick={() => setCurrentPage('home')}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Go Home
      </button>
    </div>
  </div>
);
