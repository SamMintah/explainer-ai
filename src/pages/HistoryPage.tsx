
import React from 'react';
import { Play, Download, Edit3, Sparkles, CheckCircle, Clock, FileText } from 'lucide-react';

type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error' | 'signin' | 'signup' | 'pricing';

interface HistoryPageProps {
  setCurrentPage: (page: Page) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ setCurrentPage }) => {
  const mockVideos = [
    {
      id: 1,
      title: 'Understanding Machine Learning Basics',
      source: 'Wikipedia Article',
      duration: '2:34',
      createdAt: '2 hours ago',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'completed'
    },
    {
      id: 2,
      title: 'React Hooks Deep Dive',
      source: 'Medium Article',
      duration: '3:12',
      createdAt: '1 day ago',
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Climate Change Report Summary',
      source: 'PDF Document',
      duration: '4:45',
      createdAt: '3 days ago',
      thumbnail: 'https://images.pexels.com/photos/9324336/pexels-photo-9324336.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'completed'
    },
    {
      id: 4,
      title: 'Quantum Computing Explained',
      source: 'Research Paper',
      duration: '1:58',
      createdAt: '1 week ago',
      thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'processing'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Your Video Library</h1>
          <p className="text-xl text-slate-600">Access and manage all your generated explainer videos</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>All Videos</option>
              <option>Completed</option>
              <option>Processing</option>
              <option>Failed</option>
            </select>
            <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>Recent First</option>
              <option>Oldest First</option>
              <option>Longest Duration</option>
              <option>Shortest Duration</option>
            </select>
          </div>
          <button 
            onClick={() => setCurrentPage('app')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create New</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-200 group">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200">
                    <Play className="w-6 h-6 text-purple-600 ml-0.5" />
                  </button>
                </div>
                <div className="absolute top-3 right-3">
                  {video.status === 'completed' ? (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Ready
                    </div>
                  ) : (
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Processing
                    </div>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{video.title}</h3>
                <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                  <span>{video.source}</span>
                  <span>{video.createdAt}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-purple-50 text-purple-600 px-3 py-2 rounded-lg font-medium hover:bg-purple-100 transition-colors duration-200 flex items-center justify-center space-x-1">
                    <Play className="w-4 h-4" />
                    <span>Watch</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No videos yet</h3>
            <p className="text-slate-600 mb-6">Create your first explainer video to get started</p>
            <button 
              onClick={() => setCurrentPage('app')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Generate Your First Video
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default HistoryPage;
