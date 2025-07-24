
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Download, Edit3, Sparkles, CheckCircle, Clock, FileText, AlertCircle, RefreshCw } from 'lucide-react';

type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error' | 'signin' | 'signup' | 'pricing';

interface HistoryPageProps {
  setCurrentPage: (page: Page) => void;
}

// Types for video history
interface VideoJob {
  id: string;
  title: string;
  inputType: 'url' | 'file' | 'text';
  source: string;
  status: 'queued' | 'processing' | 'done' | 'error';
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
  metadata?: {
    voice?: string;
    style?: string;
    originalUrl?: string;
    fileName?: string;
  };
}

interface VideoHistoryResponse {
  videos: VideoJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('explainer_auth_token');
};

// Create headers with auth token
const createAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API functions
const fetchVideoHistory = async (
  page: number = 1,
  limit: number = 12,
  status?: string,
  sortBy: string = 'createdAt',
  sortOrder: string = 'desc'
): Promise<VideoHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
  });

  if (status && status !== 'all') {
    params.append('status', status);
  }

  const response = await fetch(`${API_BASE_URL}/api/video-job/history?${params}`, {
    headers: createAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const downloadVideo = async (jobId: string): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/api/video-job/${jobId}/download`, {
    headers: createAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to download video');
  }

  return response.blob();
};

const deleteVideoJob = async (jobId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/video-job/${jobId}`, {
    method: 'DELETE',
    headers: createAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete video');
  }
};

// Utility functions
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  return date.toLocaleDateString();
};

const getSourceDisplay = (video: VideoJob): string => {
  switch (video.inputType) {
    case 'url':
      return video.metadata?.originalUrl ? new URL(video.metadata.originalUrl).hostname : 'Web Article';
    case 'file':
      return video.metadata?.fileName || 'Uploaded File';
    case 'text':
      return 'Text Input';
    default:
      return 'Unknown Source';
  }
};

const generateThumbnail = (video: VideoJob): string => {
  // Generate a placeholder thumbnail based on video type and status
  const baseUrl = 'https://images.pexels.com/photos';
  const thumbnails = {
    url: '8386440/pexels-photo-8386440.jpeg',
    file: '11035380/pexels-photo-11035380.jpeg',
    text: '9324336/pexels-photo-9324336.jpeg',
  };
  
  const thumbnail = thumbnails[video.inputType] || thumbnails.text;
  return video.thumbnailUrl || `${baseUrl}/${thumbnail}?auto=compress&cs=tinysrgb&w=400`;
};

const HistoryPage: React.FC<HistoryPageProps> = ({ setCurrentPage }) => {
  // State management
  const [videos, setVideos] = useState<VideoJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPageState] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load video history
  const loadVideoHistory = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      const response = await fetchVideoHistory(
        currentPage,
        12,
        statusFilter,
        sortBy,
        sortOrder
      );

      setVideos(response.videos);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error loading video history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load video history');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPage, statusFilter, sortBy, sortOrder]);

  // Initial load
  useEffect(() => {
    loadVideoHistory();
  }, [loadVideoHistory]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadVideoHistory(false);
  }, [loadVideoHistory]);

  // Handle filter changes
  const handleStatusFilterChange = useCallback((newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPageState(1);
  }, []);

  const handleSortChange = useCallback((newSortBy: string) => {
    const [field, order] = newSortBy.split(':');
    setSortBy(field);
    setSortOrder(order);
    setCurrentPageState(1);
  }, []);

  // Handle video actions
  const handlePlayVideo = useCallback((video: VideoJob) => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank');
    }
  }, []);

  const handleDownloadVideo = useCallback(async (video: VideoJob) => {
    try {
      const blob = await downloadVideo(video.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.title}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading video:', err);
      alert('Failed to download video. Please try again.');
    }
  }, []);

  const handleDeleteVideo = useCallback(async (video: VideoJob) => {
    if (!confirm(`Are you sure you want to delete "${video.title}"?`)) {
      return;
    }

    try {
      await deleteVideoJob(video.id);
      // Refresh the list
      loadVideoHistory(false);
    } catch (err) {
      console.error('Error deleting video:', err);
      alert('Failed to delete video. Please try again.');
    }
  }, [loadVideoHistory]);

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPageState(newPage);
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Your Video Library</h1>
            <p className="text-xl text-slate-600">Access and manage all your generated explainer videos</p>
          </div>
          
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading your videos...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Your Video Library</h1>
            <p className="text-xl text-slate-600">Access and manage all your generated explainer videos</p>
          </div>
          
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Failed to load videos</h3>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={handleRefresh}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Your Video Library</h1>
          <p className="text-xl text-slate-600">Access and manage all your generated explainer videos</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <select 
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Videos</option>
              <option value="done">Completed</option>
              <option value="processing">Processing</option>
              <option value="queued">Queued</option>
              <option value="error">Failed</option>
            </select>
            <select 
              value={`${sortBy}:${sortOrder}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="createdAt:desc">Recent First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="title:asc">Title A-Z</option>
              <option value="title:desc">Title Z-A</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <button 
            onClick={() => setCurrentPage('app')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create New</span>
          </button>
        </div>

        {videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-200 group">
                  <div className="relative">
                    <img 
                      src={generateThumbnail(video)} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    {video.status === 'done' && video.videoUrl && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button 
                          onClick={() => handlePlayVideo(video)}
                          className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200"
                        >
                          <Play className="w-6 h-6 text-purple-600 ml-0.5" />
                        </button>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      {video.status === 'done' ? (
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          Ready
                        </div>
                      ) : video.status === 'processing' ? (
                        <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Processing
                        </div>
                      ) : video.status === 'queued' ? (
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Queued
                        </div>
                      ) : (
                        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          <AlertCircle className="w-3 h-3 inline mr-1" />
                          Failed
                        </div>
                      )}
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                        {video.duration}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2" title={video.title}>
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                      <span title={getSourceDisplay(video)}>{getSourceDisplay(video)}</span>
                      <span>{formatRelativeTime(video.createdAt)}</span>
                    </div>
                    
                    {video.error && (
                      <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                        {video.error}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      {video.status === 'done' && video.videoUrl ? (
                        <button 
                          onClick={() => handlePlayVideo(video)}
                          className="flex-1 bg-purple-50 text-purple-600 px-3 py-2 rounded-lg font-medium hover:bg-purple-100 transition-colors duration-200 flex items-center justify-center space-x-1"
                        >
                          <Play className="w-4 h-4" />
                          <span>Watch</span>
                        </button>
                      ) : (
                        <div className="flex-1 bg-slate-50 text-slate-400 px-3 py-2 rounded-lg font-medium flex items-center justify-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{video.status === 'processing' ? 'Processing' : video.status === 'queued' ? 'Queued' : 'Unavailable'}</span>
                        </div>
                      )}
                      
                      {video.status === 'done' && video.videoUrl && (
                        <button 
                          onClick={() => handleDownloadVideo(video)}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                          title="Download video"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteVideo(video)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete video"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      page === currentPage
                        ? 'text-purple-600 bg-purple-50 border border-purple-300'
                        : 'text-slate-500 bg-white border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
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
};

export default HistoryPage;
