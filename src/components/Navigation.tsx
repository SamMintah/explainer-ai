
import React, { useState, useEffect, useRef } from 'react';
import { Play, Menu, X, Sparkles } from 'lucide-react';

type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error' | 'signin' | 'signup' | 'pricing';

interface NavigationProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  handleTryDemo: () => void;
  isLoggedIn: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage, handleTryDemo, isLoggedIn, handleLogin, handleLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className={`${isLoggedIn ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'} border-b border-slate-200 sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
             {isLoggedIn ? <Play className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
             </div>
            <span className="text-xl font-bold text-slate-900">ExplainerAI</span>
          </div>

          <div className="flex items-center space-x-8">
            {!isLoggedIn ? (
              <>
                <nav className="hidden md:flex space-x-8">
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Home
                  </button>
                  <button className="text-slate-600 hover:text-slate-900 transition-colors">
                    Use Cases
                  </button>
                  <button 
                    onClick={() => setCurrentPage('pricing')}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Pricing
                  </button>
                </nav>
                <div className="hidden md:flex items-center space-x-4">
                  <button 
                    onClick={() => setCurrentPage('signin')}
                    className="text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setCurrentPage('signup')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Start Free
                  </button>
                </div>
              </>
            ) : (
              <>
                <nav className="hidden md:flex space-x-8">
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className={`transition-colors ${currentPage === 'home' ? 'text-purple-600' : 'text-slate-600 hover:text-purple-600'}`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => setCurrentPage('app')}
                    className={`transition-colors ${currentPage === 'app' ? 'text-purple-600' : 'text-slate-600 hover:text-purple-600'}`}
                  >
                    Generator
                  </button>
                  <button 
                    onClick={() => setCurrentPage('history')}
                    className={`transition-colors ${currentPage === 'history' ? 'text-purple-600' : 'text-slate-600 hover:text-purple-600'}`}
                  >
                    History
                  </button>
                  <button 
                    onClick={() => setCurrentPage('settings')}
                    className={`transition-colors ${currentPage === 'settings' ? 'text-purple-600' : 'text-slate-600 hover:text-purple-600'}`}
                  >
                    Settings
                  </button>
                  <button 
                    onClick={() => setCurrentPage('pricing')}
                    className={`transition-colors ${currentPage === 'pricing' ? 'text-purple-600' : 'text-slate-600 hover:text-purple-600'}`}
                  >
                    Pricing
                  </button>
                </nav>
                <div className="hidden md:flex items-center space-x-4">
                  <button 
                    onClick={handleTryDemo}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Generate Explainer
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with improved styling and animations */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {!isLoggedIn ? (
            <>
              <button 
                onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-3 rounded-lg text-slate-700 hover:text-purple-600 hover:bg-slate-50 transition-all duration-200 ${
                  currentPage === 'home' ? 'text-purple-600 bg-purple-50' : ''
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-3 rounded-lg text-slate-700 hover:text-purple-600 hover:bg-slate-50 transition-all duration-200"
              >
                Use Cases
              </button>
              <button 
                onClick={() => { setCurrentPage('pricing'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-3 rounded-lg text-slate-700 hover:text-purple-600 hover:bg-slate-50 transition-all duration-200 ${
                  currentPage === 'pricing' ? 'text-purple-600 bg-purple-50' : ''
                }`}
              >
                Pricing
              </button>
              <button 
                onClick={() => { setCurrentPage('signin'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-3 rounded-lg text-slate-700 hover:text-purple-600 hover:bg-slate-50 transition-all duration-200 ${
                  currentPage === 'signin' ? 'text-purple-600 bg-purple-50' : ''
                }`}
              >
                Sign In
              </button>
              <div className="pt-2 mt-2 border-t border-slate-200">
                <button 
                  onClick={() => { setCurrentPage('signup'); setIsMobileMenuOpen(false); }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Start Free
                </button>
              </div>
            </>
          ) : (
            <>
              <button 
                onClick={() => { setCurrentPage('app'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-3 rounded-lg text-slate-700 hover:text-purple-600 hover:bg-slate-50 transition-all duration-200 ${
                  currentPage === 'app' ? 'text-purple-600 bg-purple-50' : ''
                }`}
              >
                Generator
              </button>
              <button 
                onClick={() => { setCurrentPage('history'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-3 rounded-lg text-slate-700 hover:text-purple-600 hover:bg-slate-50 transition-all duration-200 ${
                  currentPage === 'history' ? 'text-purple-600 bg-purple-50' : ''
                }`}
              >
                History
              </button>
              <button 
                onClick={() => { setCurrentPage('settings'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-3 rounded-lg text-slate-700 hover:text-purple-600 hover:bg-slate-50 transition-all duration-200 ${
                  currentPage === 'settings' ? 'text-purple-600 bg-purple-50' : ''
                }`}
              >
                Settings
              </button>
              <button 
                onClick={() => { setCurrentPage('pricing'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-3 rounded-lg text-slate-700 hover:text-purple-600 hover:bg-slate-50 transition-all duration-200 ${
                  currentPage === 'pricing' ? 'text-purple-600 bg-purple-50' : ''
                }`}
              >
                Pricing
              </button>
              <div className="pt-2 mt-2 border-t border-slate-200 space-y-2">
                <button 
                  onClick={() => { handleTryDemo(); setIsMobileMenuOpen(false); }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Generate Explainer
                </button>
                <button 
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-slate-600 hover:text-slate-900 px-4 py-3 rounded-lg hover:bg-slate-100 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
