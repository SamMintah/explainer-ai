
import React, { useState, useEffect } from 'react';
import { Users, Play, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type Page = 'home' | 'app' | 'history' | 'settings' | 'loading' | '404' | 'error' | 'signin' | 'signup' | 'pricing';

interface SettingsPageProps {
  setCurrentPage: (page: Page) => void;
}

// Types for user settings
interface UserSettings {
  voice: string;
  speakingSpeed: number;
  videoLength: string;
  visualStyle: string;
  autoSave: boolean;
  emailNotifications: boolean;
  analytics: boolean;
}

// API functions for settings management
const getAuthToken = (): string | null => {
  return localStorage.getItem('jwt-token');
};

const apiRequest = async <T,>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const API_BASE_URL = process.env.NODE_ENV === "production"
    ? process.env.VITE_API_URL || "https://api.explainer.ai"
    : "http://localhost:3001/api";

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

const loadUserSettings = async (): Promise<UserSettings> => {
  return apiRequest<UserSettings>('/user/settings');
};

const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  await apiRequest('/user/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
};

const SettingsPage: React.FC<SettingsPageProps> = ({ setCurrentPage }) => {
  // State for settings
  const [selectedVoice, setSelectedVoice] = useState('female-us');
  const [speakingSpeed, setSpeakingSpeed] = useState(1);
  const [videoLength, setVideoLength] = useState('standard');
  const [visualStyle, setVisualStyle] = useState('modern');
  const [autoSave, setAutoSave] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  // State for UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const settings = await loadUserSettings();
        
        setSelectedVoice(settings.voice);
        setSpeakingSpeed(settings.speakingSpeed);
        setVideoLength(settings.videoLength);
        setVisualStyle(settings.visualStyle);
        setAutoSave(settings.autoSave);
        setEmailNotifications(settings.emailNotifications);
        setAnalytics(settings.analytics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings function
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const settings: UserSettings = {
        voice: selectedVoice,
        speakingSpeed,
        videoLength,
        visualStyle,
        autoSave,
        emailNotifications,
        analytics,
      };

      await saveUserSettings(settings);
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Clear error message
  const clearError = () => setError(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Settings & Preferences</h1>
          <p className="text-xl text-slate-600">Customize your explainer video generation experience</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Voice Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span>Voice & Narration</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Voice Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'female-us', name: 'Sarah (Female, US)', accent: 'American English' },
                    { id: 'male-us', name: 'David (Male, US)', accent: 'American English' },
                    { id: 'female-uk', name: 'Emma (Female, UK)', accent: 'British English' },
                    { id: 'male-uk', name: 'James (Male, UK)', accent: 'British English' }
                  ].map((voice) => (
                    <div
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedVoice === voice.id
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-medium text-slate-900">{voice.name}</div>
                      <div className="text-sm text-slate-500">{voice.accent}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Speaking Speed ({speakingSpeed}x)
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-500">Slow</span>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    value={speakingSpeed}
                    onChange={(e) => setSpeakingSpeed(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-slate-500">Fast</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <span>Video Preferences</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Default Video Length</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'quick', name: 'Quick Summary', desc: '1-2 minutes', time: '⚡' },
                    { id: 'standard', name: 'Standard', desc: '2-4 minutes', time: '⏱️' },
                    { id: 'detailed', name: 'Deep Dive', desc: '4-6 minutes', time: '📚' }
                  ].map((length) => (
                    <div
                      key={length.id}
                      onClick={() => setVideoLength(length.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center ${
                        videoLength === length.id
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{length.time}</div>
                      <div className="font-medium text-slate-900">{length.name}</div>
                      <div className="text-sm text-slate-500">{length.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Visual Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'modern', name: 'Modern', desc: 'Clean, minimal design' },
                    { id: 'creative', name: 'Creative', desc: 'Colorful, dynamic' },
                    { id: 'professional', name: 'Professional', desc: 'Business-focused' }
                  ].map((style) => (
                    <div
                      key={style.id}
                      onClick={() => setVisualStyle(style.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        visualStyle === style.id
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-medium text-slate-900">{style.name}</div>
                      <div className="text-sm text-slate-500">{style.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span>Account & Privacy</span>
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">Auto-save generated videos</div>
                  <div className="text-sm text-slate-500">Automatically save videos to your library</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">Email notifications</div>
                  <div className="text-sm text-slate-500">Get notified when videos are ready</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">Analytics & improvement</div>
                  <div className="text-sm text-slate-500">Help us improve the service with usage data</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
