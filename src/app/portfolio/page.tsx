"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSupabaseVideos, useSupabasePhotos } from '@/hooks/useDatabase';
import { usePageViewTracking, useAnalytics } from '@/hooks/useAnalytics';
import { VideoRecord, PhotoRecord } from '@/lib/database';

export default function Portfolio() {
  const [portfolioVideos, setPortfolioVideos] = useState<VideoRecord[]>([]);
  const [portfolioPhotos, setPortfolioPhotos] = useState<PhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'snaps'>('videos');
  const [currentVideoPage, setCurrentVideoPage] = useState(0);
  const [currentPhotoPage, setCurrentPhotoPage] = useState(0);
  const videosPerPage = 4;
  const photosPerPage = 4;
  const { getVideos } = useSupabaseVideos();
  const { getPhotos } = useSupabasePhotos();
  const { trackVideoView, trackPhotoView } = useAnalytics();

  // Track page view
  usePageViewTracking('/portfolio', { tab: activeTab });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [videosData, photosData] = await Promise.all([
        getVideos('portfolio'),
        getPhotos('portfolio')
      ]);
      setPortfolioVideos(videosData);
      setPortfolioPhotos(photosData);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getDisplayVideos = () => {
    const startIndex = currentVideoPage * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    return portfolioVideos.slice(startIndex, endIndex);
  };

  const getDisplayPhotos = () => {
    const startIndex = currentPhotoPage * photosPerPage;
    const endIndex = startIndex + photosPerPage;
    return portfolioPhotos.slice(startIndex, endIndex);
  };

  const getTotalVideoPages = () => Math.ceil(portfolioVideos.length / videosPerPage);
  const getTotalPhotoPages = () => Math.ceil(portfolioPhotos.length / photosPerPage);

  const nextVideoPage = () => {
    setCurrentVideoPage(prev => (prev + 1) % getTotalVideoPages());
  };

  const prevVideoPage = () => {
    setCurrentVideoPage(prev => prev === 0 ? getTotalVideoPages() - 1 : prev - 1);
  };

  const nextPhotoPage = () => {
    setCurrentPhotoPage(prev => (prev + 1) % getTotalPhotoPages());
  };

  const prevPhotoPage = () => {
    setCurrentPhotoPage(prev => prev === 0 ? getTotalPhotoPages() - 1 : prev - 1);
  };

  const nextVideo = useCallback(() => {
    if (!selectedVideo) return;
    const currentIndex = portfolioVideos.findIndex(v => v.id === selectedVideo.id);
    const nextIndex = (currentIndex + 1) % portfolioVideos.length;
    setSelectedVideo(portfolioVideos[nextIndex]);
  }, [selectedVideo, portfolioVideos]);

  const prevVideo = useCallback(() => {
    if (!selectedVideo) return;
    const currentIndex = portfolioVideos.findIndex(v => v.id === selectedVideo.id);
    const prevIndex = currentIndex === 0 ? portfolioVideos.length - 1 : currentIndex - 1;
    setSelectedVideo(portfolioVideos[prevIndex]);
  }, [selectedVideo, portfolioVideos]);

  const nextPhoto = useCallback(() => {
    if (!selectedPhoto) return;
    const currentIndex = portfolioPhotos.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % portfolioPhotos.length;
    setSelectedPhoto(portfolioPhotos[nextIndex]);
  }, [selectedPhoto, portfolioPhotos]);

  const prevPhoto = useCallback(() => {
    if (!selectedPhoto) return;
    const currentIndex = portfolioPhotos.findIndex(p => p.id === selectedPhoto.id);
    const prevIndex = currentIndex === 0 ? portfolioPhotos.length - 1 : currentIndex - 1;
    setSelectedPhoto(portfolioPhotos[prevIndex]);
  }, [selectedPhoto, portfolioPhotos]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (selectedVideo) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevVideo();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextVideo();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setSelectedVideo(null);
      }
    } else if (selectedPhoto) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevPhoto();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextPhoto();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setSelectedPhoto(null);
      }
    }
  }, [selectedVideo, selectedPhoto, prevVideo, nextVideo, prevPhoto, nextPhoto]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-slate-800 mb-6 tracking-wide">
            PORTFOLIO
          </h1>
          <p className="text-xl sm:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
            Every frame tells a story, every story becomes a legacy
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <div className="flex bg-white/70 backdrop-blur-sm rounded-full p-1 mt-8 shadow-lg">
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'videos'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                🎬 Films
              </button>
              <button
                onClick={() => setActiveTab('snaps')}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'snaps'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                📸 Snaps
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 bg-cover bg-center bg-no-repeat min-h-screen relative" style={{backgroundImage: 'url(/portfolio.jpg)'}}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-light text-white mb-4">Cinematic Wedding Films</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Each film is a carefully crafted narrative of love, laughter, and lifelong commitment
                </p>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <p className="text-white mt-4">Loading films...</p>
                </div>
              ) : getDisplayVideos().length > 0 ? (
                <>
                  <div className="relative">
                    {/* Navigation Arrows */}
                    {getTotalVideoPages() > 1 && (
                      <>
                        <button
                          onClick={prevVideoPage}
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                        >
                          <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextVideoPage}
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                        >
                          <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {getDisplayVideos().map((video) => (
                        <div 
                          key={video.id} 
                          className="group cursor-pointer"
                          onClick={() => {
                            setSelectedVideo(video);
                            trackVideoView(video.id, video.name, '/portfolio');
                          }}
                        >
                          <div className="relative aspect-[4/5] bg-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                            <video 
                              src={video.file_path} 
                              className="w-full h-full object-cover"
                              preload="metadata"
                              muted
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300"></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-6 h-6 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                              <h3 className="text-white font-medium text-sm">{video.name}</h3>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Page Indicators */}
                  {getTotalVideoPages() > 1 && (
                    <div className="flex justify-center items-center space-x-2 mb-8">
                      {Array.from({ length: getTotalVideoPages() }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentVideoPage(i)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            i === currentVideoPage 
                              ? 'bg-purple-600 scale-125' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                      <span className="text-white/70 ml-4 text-sm">
                        {currentVideoPage + 1} of {getTotalVideoPages()}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-6">🎬</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">No Films Yet</h3>
                  <p className="text-gray-300 max-w-md mx-auto">
                    Our cinematic collection is being curated. Check back soon to see our latest wedding films!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'snaps' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-light text-white mb-4">Wedding Photography</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Capturing the perfect moments that tell your unique love story
                </p>
              </div>

              {getDisplayPhotos().length > 0 ? (
                <>
                  <div className="relative">
                    {/* Navigation Arrows */}
                    {getTotalPhotoPages() > 1 && (
                      <>
                        <button
                          onClick={prevPhotoPage}
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                        >
                          <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextPhotoPage}
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                        >
                          <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {getDisplayPhotos().map((photo) => (
                        <div 
                          key={photo.id} 
                          className="group cursor-pointer"
                          onClick={() => {
                            setSelectedPhoto(photo);
                            trackPhotoView(photo.id, photo.name, '/portfolio');
                          }}
                        >
                          <div className="relative aspect-[4/5] bg-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                            <img 
                              src={photo.file_path} 
                              alt={photo.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <h3 className="text-white font-medium text-sm">{photo.name}</h3>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Page Indicators */}
                  {getTotalPhotoPages() > 1 && (
                    <div className="flex justify-center items-center space-x-2 mb-8">
                      {Array.from({ length: getTotalPhotoPages() }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPhotoPage(i)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            i === currentPhotoPage 
                              ? 'bg-purple-600 scale-125' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                      <span className="text-white/70 ml-4 text-sm">
                        {currentPhotoPage + 1} of {getTotalPhotoPages()}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-6">📸</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">No Photos Yet</h3>
                  <p className="text-gray-300 max-w-md mx-auto">
                    Our photography collection is being curated. Check back soon to see our latest wedding photos!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Navigation Arrows */}
            {portfolioVideos.length > 1 && (
              <>
                <button
                  onClick={prevVideo}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextVideo}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <video 
                  src={selectedVideo.file_path} 
                  className="w-full h-full"
                  controls
                  autoPlay
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">{selectedVideo.name}</h3>
                    <p className="text-gray-300">
                      Created {new Date(selectedVideo.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {portfolioVideos.length > 1 && (
                    <div className="text-white/70 text-sm">
                      {portfolioVideos.findIndex(v => v.id === selectedVideo.id) + 1} of {portfolioVideos.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Arrows */}
            {portfolioPhotos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3]">
                <img 
                  src={selectedPhoto.file_path} 
                  alt={selectedPhoto.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">{selectedPhoto.name}</h3>
                    <p className="text-gray-300">{selectedPhoto.description || 'Professional wedding photography'}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Created {new Date(selectedPhoto.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {portfolioPhotos.length > 1 && (
                    <div className="text-white/70 text-sm">
                      {portfolioPhotos.findIndex(p => p.id === selectedPhoto.id) + 1} of {portfolioPhotos.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-6">
            Ready to Create Your Story?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Let us capture the magic of your special day with the same passion and artistry
          </p>
          <Link 
            href="/#contact" 
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            Get In Touch
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
