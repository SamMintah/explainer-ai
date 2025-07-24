
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LoadingPage from './pages/LoadingPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import ErrorPage from './pages/ErrorPage';
import AppPage from './pages/AppPage';
import NotFoundPage from './pages/NotFoundPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import PricingPage from './pages/PricingPage';
import { useVideoGeneration } from './hooks/useVideoGeneration';
import { useAuth } from './hooks/useAuth';

type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error' | 'signin' | 'signup' | 'pricing';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentView, setCurrentView] = useState<'input' | 'workspace'>('input');
  const [errorType, setErrorType] = useState<'url' | 'file' | 'generation' | 'network'>('url');
  const [inputUrl, setInputUrl] = useState<string>('');
  
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    login,
    register,
    logout,
    checkAuthStatus
  } = useAuth();
  
  const {
    jobId,
    status,
    progress,
    error,
    videoUrl,
    generateVideo,
    reset
  } = useVideoGeneration();

  // Protected pages that require authentication
  const protectedPages: Page[] = ['app', 'history', 'settings'];
  
  const shouldShowNavigation = (): boolean => {
    const pagesWithNavigation: Page[] = ['home', 'app', 'history', 'settings', 'pricing'];
    return pagesWithNavigation.includes(currentPage);
  };

  // Check if current page requires authentication
  const isProtectedPage = (page: Page): boolean => {
    return protectedPages.includes(page);
  };

  // Redirect to sign in if trying to access protected page without authentication
  const checkPageAccess = (page: Page): Page => {
    if (isProtectedPage(page) && !isAuthenticated) {
      return 'signin';
    }
    return page;
  };

  const handleGenerate = async (url?: string, voice?: string, style?: string) => {
    const urlToUse = url || inputUrl;
    
    if (!urlToUse) {
      handleError('url');
      return;
    }

    try {
      setCurrentPage('loading');
      await generateVideo(urlToUse, voice, style);
    } catch (err) {
      console.error('Video generation failed:', err);
      handleError('generation');
    }
  };

  const handleTryDemo = () => {
    setCurrentPage('app');
  };

  const handleBackToInput = () => {
    setCurrentView('input');
  };

  const handleError = (type: 'url' | 'file' | 'generation' | 'network') => {
    setErrorType(type);
    setCurrentPage('error');
  };

  const handleRetry = () => {
    reset();
    setCurrentPage('app');
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      // Redirect to app page after successful login
      setCurrentPage('app');
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw to let the SignInPage handle the error
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      await register({ email, password, name });
      // Redirect to app page after successful registration
      setCurrentPage('app');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error; // Re-throw to let the SignUpPage handle the error
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentPage('home');
      setCurrentView('input');
      reset(); // Reset video generation state
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to home even if logout API fails
      setCurrentPage('home');
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider} - to be implemented`);
    // TODO: Implement social login integration
    // This would typically redirect to OAuth provider
  };

  // Effect to handle video generation status changes
  useEffect(() => {
    if (status === 'done' && videoUrl) {
      setTimeout(() => {
        setCurrentView('workspace');
        setCurrentPage('app');
      }, 500);
    } else if (status === 'error' && error) {
      // Determine error type based on error message
      if (error.includes('URL') || error.includes('url')) {
        setErrorType('url');
      } else if (error.includes('network') || error.includes('connection')) {
        setErrorType('network');
      } else {
        setErrorType('generation');
      }
      setCurrentPage('error');
    }
  }, [status, videoUrl, error]);

  // Initialize authentication on app start
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Handle authentication state changes
  useEffect(() => {
    if (!authLoading) {
      // If user was on a protected page but is no longer authenticated, redirect to signin
      if (isProtectedPage(currentPage) && !isAuthenticated) {
        setCurrentPage('signin');
      }
      // If user is authenticated and on signin/signup page, redirect to app
      else if (isAuthenticated && (currentPage === 'signin' || currentPage === 'signup')) {
        setCurrentPage('app');
      }
    }
  }, [isAuthenticated, authLoading, currentPage]);

  // Reset view to input when navigating away from app page
  const handlePageChange = (page: Page) => {
    const targetPage = checkPageAccess(page);
    
    if (targetPage !== 'app') {
      setCurrentView('input');
      reset(); // Reset video generation state when leaving app
    }
    setCurrentPage(targetPage);
  };

  const renderPage = () => {
    // Show loading spinner while checking authentication
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage 
          setCurrentPage={handlePageChange} 
          handleGenerate={handleGenerate}
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
        />;
      case 'loading':
        return <LoadingPage 
          status={status}
          progress={progress}
          jobId={jobId}
        />;
      case 'history':
        return isAuthenticated ? (
          <HistoryPage setCurrentPage={handlePageChange} />
        ) : (
          <SignInPage onLogin={handleLogin} onSocialLogin={handleSocialLogin} onNavigate={handlePageChange} />
        );
      case 'settings':
        return isAuthenticated ? (
          <SettingsPage setCurrentPage={handlePageChange} />
        ) : (
          <SignInPage onLogin={handleLogin} onSocialLogin={handleSocialLogin} onNavigate={handlePageChange} />
        );
      case 'error':
        return <ErrorPage 
          errorType={errorType} 
          handleRetry={handleRetry} 
          setCurrentPage={handlePageChange}
          errorMessage={error}
        />;
      case 'app':
        return isAuthenticated ? (
          <AppPage 
            setCurrentPage={handlePageChange} 
            handleGenerate={handleGenerate} 
            handleError={handleError}
            currentView={currentView}
            setCurrentView={setCurrentView}
            handleBackToInput={handleBackToInput}
            videoUrl={videoUrl}
            inputUrl={inputUrl}
            setInputUrl={setInputUrl}
          />
        ) : (
          <SignInPage onLogin={handleLogin} onSocialLogin={handleSocialLogin} onNavigate={handlePageChange} />
        );
      case 'signin':
        return <SignInPage onLogin={handleLogin} onSocialLogin={handleSocialLogin} onNavigate={handlePageChange} />;
      case 'signup':
        return <SignUpPage onRegister={handleRegister} onSocialLogin={handleSocialLogin} onNavigate={handlePageChange} />;
      case 'pricing':
        return <PricingPage setCurrentPage={handlePageChange} />;
      default:
        return <NotFoundPage setCurrentPage={handlePageChange} />;
    }
  };

  return (
    <div>
      {shouldShowNavigation() && !authLoading && (
        <Navigation 
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          handleTryDemo={handleTryDemo}
          isLoggedIn={isAuthenticated}
          user={user}
          handleLogin={() => setCurrentPage('signin')}
          handleLogout={handleLogout}
        />
      )}
      {renderPage()}
    </div>
  );
}

export default App;
