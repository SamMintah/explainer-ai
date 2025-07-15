import {
  Link,
  Play,
  Sparkles,
  ArrowRight,
  Users,
  BookOpen,
  Briefcase,
  GraduationCap,
  Code,
  Newspaper,
  Star,
  Zap,
  Shield,
  Pause,
} from 'lucide-react';
import { useState } from 'react';
import { Navigation } from '../components/Navigation';

type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
  handleGenerate: () => void;
  handleTryDemo: () => void;
}

export const HomePage = ({ setCurrentPage, handleGenerate, handleTryDemo }: HomePageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Background animation particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-purple-200/30 to-pink-200/30 animate-float"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
        
        {/* Large Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/15 to-purple-300/15 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-gradient-to-br from-pink-300/20 to-orange-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-purple-400/30 rotate-45 animate-spin-slow" />
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-pink-400/30 rounded-full animate-bounce-slow" />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-400/30 rotate-45 animate-pulse" />
        
        {/* Animated Lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(168 85 247 / 0.1)" />
              <stop offset="100%" stopColor="rgb(236 72 153 / 0.1)" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q400,50 800,100 T1600,100"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-draw"
          />
          <path
            d="M0,200 Q600,150 1200,200 T2400,200"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            fill="none"
            className="animate-draw"
            style={{ animationDelay: '1s' }}
          />
        </svg>
      </div>

      <Navigation currentPage="home" setCurrentPage={setCurrentPage} handleTryDemo={handleTryDemo} />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Don't read it —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              watch it
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Turn articles, web pages, and documents into visual explainers with AI narration
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex-1 max-w-md">
              <input
                type="url"
                placeholder="Paste a link to try..."
                className="w-full px-6 py-4 text-lg border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button 
              onClick={handleGenerate}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Video</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
            <span>Try examples:</span>
            <button className="text-purple-600 hover:text-purple-700 font-medium">Wikipedia Article</button>
            <button className="text-purple-600 hover:text-purple-700 font-medium">Medium Post</button>
            <button className="text-purple-600 hover:text-purple-700 font-medium">Research Paper</button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Transform any content into an engaging explainer video in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <Link className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Paste or Upload</h3>
            <p className="text-slate-600 leading-relaxed">
              Share a link, upload a document, or paste text directly into our platform
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">2. AI Processing</h3>
            <p className="text-slate-600 leading-relaxed">
              Our AI analyzes, summarizes, and creates a compelling narrative script
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Watch & Share</h3>
            <p className="text-slate-600 leading-relaxed">
              Get your explainer video with visuals and AI narration ready to watch
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={handleTryDemo}
            className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <span>Try an Example</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-white py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Perfect For</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Whether you're learning, teaching, or staying informed, ExplainerAI helps you understand faster
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-200">
              <GraduationCap className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Students</h3>
              <p className="text-slate-600">Turn dense textbooks and research papers into digestible video summaries</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-200">
              <Briefcase className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Professionals</h3>
              <p className="text-slate-600">Quickly understand industry reports, documentation, and long-form content</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-200">
              <Users className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Teachers</h3>
              <p className="text-slate-600">Create engaging visual content from curriculum materials and articles</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-200">
              <Code className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Developers</h3>
              <p className="text-slate-600">Transform technical documentation into visual learning materials</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 hover:shadow-lg transition-all duration-200">
              <Newspaper className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Journalists</h3>
              <p className="text-slate-600">Convert long-form articles into engaging video content for audiences</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border border-pink-100 hover:shadow-lg transition-all duration-200">
              <BookOpen className="w-8 h-8 text-pink-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Readers</h3>
              <p className="text-slate-600">Experience articles and blog posts in a new, visual format</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">See It In Action</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Watch how a complex article becomes an engaging explainer video
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 group"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-purple-600" />
                  ) : (
                    <Play className="w-10 h-10 text-purple-600 ml-1 group-hover:scale-110 transition-transform duration-200" />
                  )}
                </button>
              </div>
              <div className="absolute top-4 left-4 bg-white/90 rounded-lg px-3 py-1">
                <span className="text-sm font-medium text-slate-700">Sample: "Understanding Machine Learning"</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 rounded-lg p-3">
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div className="bg-purple-600 h-2 rounded-full w-2/3 transition-all duration-300"></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>1:24</span>
                    <span>2:15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button 
              onClick={handleTryDemo}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
            >
              <span>Generate Your Own</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Why Choose ExplainerAI</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to make learning faster and more engaging
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200">
              <Zap className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Lightning Fast</h3>
              <p className="text-slate-600">Generate explainer videos in under 2 minutes from any content source</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200">
              <Shield className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Privacy First</h3>
              <p className="text-slate-600">Your content is processed securely and never stored permanently</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200">
              <Star className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">High Quality</h3>
              <p className="text-slate-600">Professional-grade AI narration and visually appealing presentations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Reading?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of learners who are already experiencing content in a whole new way
          </p>
          <button 
            onClick={handleTryDemo}
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
          >
            <span>Try It Now for Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};
