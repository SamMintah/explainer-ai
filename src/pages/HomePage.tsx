import React, { useState } from 'react';
import { 
  Play, 
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
  Globe,
  Link,
  Pause
} from 'lucide-react';

type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error' | 'signin' | 'signup' | 'pricing';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
  handleGenerate: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, handleGenerate }) => {
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
                <Play className="w-5 h-5" />
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
                <Star className="w-8 h-8 text-white" />
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
              onClick={() => setCurrentPage('app')}
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
                onClick={() => setCurrentPage('app')}
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
              onClick={() => setCurrentPage('app')}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
            >
              <span>Try It Now for Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 opacity-50"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">ExplainerAI</span>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Transform any content into engaging explainer videos with AI-powered narration and visuals.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">How it Works</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Use Cases</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">API Documentation</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Integrations</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Changelog</a></li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Press Kit</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Status Page</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-12 pt-8 border-t border-slate-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h3 className="text-white font-semibold mb-2">Stay updated</h3>
                  <p className="text-slate-400">Get the latest features and updates delivered to your inbox.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 lg:max-w-md">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-8 pt-8 border-t border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-slate-400 text-sm mb-4 sm:mb-0">
                © 2024 ExplainerAI. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
}

export default HomePage;
