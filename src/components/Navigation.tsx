
import { useState } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';

type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error';

interface NavigationProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  handleTryDemo: () => void;
}

export const Navigation = ({ currentPage, setCurrentPage, handleTryDemo }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">ExplainerAI</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`transition-colors duration-200 ${
                currentPage === 'home' ? 'text-purple-600 font-medium' : 'text-slate-700 hover:text-purple-600'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('app')}
              className={`transition-colors duration-200 ${
                currentPage === 'app' ? 'text-purple-600 font-medium' : 'text-slate-700 hover:text-purple-600'
              }`}
            >
              Generator
            </button>
            <button 
              onClick={() => setCurrentPage('history')}
              className={`transition-colors duration-200 ${
                currentPage === 'history' ? 'text-purple-600 font-medium' : 'text-slate-700 hover:text-purple-600'
              }`}
            >
              History
            </button>
            <button 
              onClick={() => setCurrentPage('settings')}
              className={`transition-colors duration-200 ${
                currentPage === 'settings' ? 'text-purple-600 font-medium' : 'text-slate-700 hover:text-purple-600'
              }`}
            >
              Settings
            </button>
            <button className="text-slate-700 hover:text-purple-600 transition-colors duration-200">
              Pricing
            </button>
          </div>

          <div className="hidden md:block">
            <button 
              onClick={handleTryDemo}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Generate Explainer
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-3 space-y-3">
            <button 
              onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); }}
              className="block text-slate-700 hover:text-purple-600 transition-colors duration-200"
            >
              Home
            </button>
            <button 
              onClick={() => { setCurrentPage('app'); setIsMobileMenuOpen(false); }}
              className="block text-slate-700 hover:text-purple-600 transition-colors duration-200"
            >
              Generator
            </button>
            <button 
              onClick={() => { setCurrentPage('history'); setIsMobileMenuOpen(false); }}
              className="block text-slate-700 hover:text-purple-600 transition-colors duration-200"
            >
              History
            </button>
            <button 
              onClick={() => { setCurrentPage('settings'); setIsMobileMenuOpen(false); }}
              className="block text-slate-700 hover:text-purple-600 transition-colors duration-200"
            >
              Settings
            </button>
            <button className="block text-slate-700 hover:text-purple-600 transition-colors duration-200">
              Pricing
            </button>
            <button 
              onClick={() => { handleTryDemo(); setIsMobileMenuOpen(false); }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Generate Explainer
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
