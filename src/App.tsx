import React, { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { AppPage } from './pages/AppPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoadingPage } from './pages/LoadingPage';
import { ErrorPage } from './pages/ErrorPage';
import { NotFoundPage } from './pages/NotFoundPage';

type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentView, setCurrentView] = useState<'input' | 'workspace'>('input');
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorType, setErrorType] = useState<'url' | 'file' | 'generation' | 'network'>('url');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
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
          setIsGenerating(false);
          setCurrentPage('app');
          setCurrentView('workspace');
        }, 500);
      }
    }, 1500);
  };

  const handleTryDemo = () => {
    setCurrentPage('app');
    setCurrentView('input');
  };

  const handleError = (type: 'url' | 'file' | 'generation' | 'network') => {
    setErrorType(type);
    setCurrentPage('error');
  };

  const handleRetry = () => {
    setCurrentPage('app');
    setCurrentView('input');
  };

  // Render current page
  switch (currentPage) {
    case 'home':
      return <HomePage setCurrentPage={setCurrentPage} handleGenerate={handleGenerate} handleTryDemo={handleTryDemo} />;
    case 'app':
      return <AppPage setCurrentPage={setCurrentPage} handleGenerate={handleGenerate} handleTryDemo={handleTryDemo} handleError={handleError} currentView={currentView} isGenerating={isGenerating} />;
    case 'history':
      return <HistoryPage setCurrentPage={setCurrentPage} handleTryDemo={handleTryDemo} />;
    case 'settings':
      return <SettingsPage setCurrentPage={setCurrentPage} handleTryDemo={handleTryDemo} />;
    case 'loading':
      return <LoadingPage loadingStep={loadingStep} />;
    case 'error':
      return <ErrorPage errorType={errorType} setCurrentPage={setCurrentPage} handleRetry={handleRetry} />;
    case '404':
      return <NotFoundPage setCurrentPage={setCurrentPage} />;
    default:
      return <HomePage setCurrentPage={setCurrentPage} handleGenerate={handleGenerate} handleTryDemo={handleTryDemo} />;
  }
}

export default App;
