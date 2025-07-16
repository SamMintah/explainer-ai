import React, { useState } from "react";
import {
  Upload,
  Link,
  FileText,
  Play,
  Pause,
  Download,
  Edit3,
  RefreshCw,
  Sparkles,
} from "lucide-react";

type Page =
  | "home"
  | "app"
  | "history"
  | "settings"
  | "loading"
  | "404"
  | "error"
  | "signin"
  | "signup"
  | "pricing";

interface AppPageProps {
  setCurrentPage: (page: Page) => void;
  handleGenerate: () => void;
  handleError: (type: "url" | "file" | "generation" | "network") => void;
  currentView: 'input' | 'workspace';
  setCurrentView: (view: 'input' | 'workspace') => void;
  handleBackToInput: () => void;
}

const AppPage: React.FC<AppPageProps> = ({
  setCurrentPage,
  handleGenerate,
  handleError,
  currentView,
  setCurrentView,
  handleBackToInput,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputType, setInputType] = useState<"url" | "file" | "text">("url");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);

  const segments = [
    {
      id: 1,
      title: "Introduction",
      duration: "15s",
      content: "Welcome to our explainer about...",
    },
    {
      id: 2,
      title: "Key Concepts",
      duration: "30s",
      content: "The main ideas to understand are...",
    },
    {
      id: 3,
      title: "Implementation",
      duration: "25s",
      content: "Here's how to apply these concepts...",
    },
    {
      id: 4,
      title: "Conclusion",
      duration: "10s",
      content: "To summarize what we've learned...",
    },
  ];

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "input" ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                Turn any content into an
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {" "}
                  explainer video
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Transform articles, documents, and web pages into engaging
                visual explanations with AI-powered narration
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="border-b border-slate-200 p-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setInputType("url")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      inputType === "url"
                        ? "bg-purple-100 text-purple-700 border-2 border-purple-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Link className="w-4 h-4" />
                    <span>URL</span>
                  </button>
                  <button
                    onClick={() => setInputType("file")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      inputType === "file"
                        ? "bg-purple-100 text-purple-700 border-2 border-purple-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>File</span>
                  </button>
                  <button
                    onClick={() => setInputType("text")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      inputType === "text"
                        ? "bg-purple-100 text-purple-700 border-2 border-purple-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Text</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {inputType === "url" && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                      Website URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/article"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-slate-500">
                        Try examples:
                      </span>
                      <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                        Wikipedia Article
                      </button>
                      <button
                        onClick={() => handleError("url")}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Medium Post
                      </button>
                      <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                        Documentation
                      </button>
                    </div>
                  </div>
                )}

                {inputType === "file" && (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                      isDragging
                        ? "border-purple-400 bg-purple-50"
                        : "border-slate-300 hover:border-purple-400 hover:bg-purple-50"
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragOver={(e) => e.preventDefault()}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-700 mb-2">
                      Drop your file here
                    </p>
                    <p className="text-sm text-slate-500 mb-4">
                      or click to browse
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                    />
                    <button
                      onClick={() => handleError("file")}
                      className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                    >
                      Choose File
                    </button>
                    <p className="text-xs text-slate-400 mt-2">
                      PDF, DOCX, TXT up to 10MB
                    </p>
                  </div>
                )}

                {inputType === "text" && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                      Paste your content
                    </label>
                    <textarea
                      rows={8}
                      placeholder="Paste your article, document, or any text content here..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                )}

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Explainer Video</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Success feedback message */}
            <div className="max-w-4xl mx-auto mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-green-800 font-medium">Video generated successfully!</p>
                  <p className="text-green-700 text-sm">Your explainer video is ready for preview and editing.</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Content Breakdown
                </h3>
                <div className="space-y-3">
                  {segments.map((segment) => (
                    <div
                      key={segment.id}
                      onClick={() =>
                        setSelectedSegment(
                          selectedSegment === segment.id ? null : segment.id
                        )
                      }
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedSegment === segment.id
                          ? "bg-purple-50 border-2 border-purple-200"
                          : "bg-slate-50 hover:bg-slate-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-900">
                          {segment.title}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {segment.duration}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 truncate">
                        {segment.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">
                      Video Preview
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={handleBackToInput}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                      >
                        New Video
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                        <RefreshCw className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-purple-600" />
                        ) : (
                          <Play className="w-8 h-8 text-purple-600 ml-1" />
                        )}
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 rounded-lg p-2">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">
                      Generated Script
                    </h2>
                    <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors duration-200">
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Script</span>
                    </button>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-4">
                      {segments.map((segment) => (
                        <div
                          key={segment.id}
                          className="border-l-4 border-purple-200 pl-4"
                        >
                          <h4 className="font-medium text-slate-900 mb-2">
                            {segment.title}
                          </h4>
                          <p className="text-slate-700 leading-relaxed">
                            {segment.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppPage;
