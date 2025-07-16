
import React, { useState } from 'react';
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

type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error' | 'signin' | 'signup' | 'pricing';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentView, setCurrentView] = useState<'input' | 'workspace'>('input');
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorType, setErrorType] = useState<'url' | 'file' | 'generation' | 'network'>('url');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const shouldShowNavigation = (): boolean => {
    const pagesWithNavigation: Page[] = ['home', 'app', 'history', 'settings', 'pricing'];
    return pagesWithNavigation.includes(currentPage);
  };

  const handleGenerate = () => {
    setCurrentPage('loading');
    setLoadingStep(0);
    
    // Simulate loading steps
    const steps = ['Analyzing content...', 'Generating script...', 'Creating visuals...', 'Rendering video...'];
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      setLoadingStep(step);
      
      if (step >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentView('workspace');
          setCurrentPage('app');
        }, 500);
      }
    }, 1500);
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
    setCurrentPage('app');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // Here you would integrate with your auth provider
    // For demo purposes, we'll just redirect to the app
    setIsLoggedIn(true);
    setTimeout(() => {
      setCurrentPage('app');
    }, 1000);
  };

  // Reset view to input when navigating away from app page
  const handlePageChange = (page: Page) => {
    if (page !== 'app') {
      setCurrentView('input');
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={handlePageChange} handleGenerate={handleGenerate} />;
      case 'loading':
        return <LoadingPage loadingStep={loadingStep} />;
      case 'history':
        return <HistoryPage setCurrentPage={handlePageChange} />;
      case 'settings':
        return <SettingsPage setCurrentPage={handlePageChange} />;
      case 'error':
        return <ErrorPage errorType={errorType} handleRetry={handleRetry} setCurrentPage={handlePageChange} />;
      case 'app':
        return <AppPage 
          setCurrentPage={handlePageChange} 
          handleGenerate={handleGenerate} 
          handleError={handleError}
          currentView={currentView}
          setCurrentView={setCurrentView}
          handleBackToInput={handleBackToInput}
        />;
      case 'signin':
        return <SignInPage onSocialLogin={handleSocialLogin} onNavigate={handlePageChange} />;
      case 'signup':
        return <SignUpPage onSocialLogin={handleSocialLogin} onNavigate={handlePageChange} />;
      case 'pricing':
        return <PricingPage setCurrentPage={handlePageChange} />;
      default:
        return <NotFoundPage setCurrentPage={handlePageChange} />;
    }
  };

  return (
    <div>
      {shouldShowNavigation() && (
        <Navigation 
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          handleTryDemo={handleTryDemo}
          isLoggedIn={isLoggedIn}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
      )}
      {renderPage()}
    </div>
  );
}

export default App;
