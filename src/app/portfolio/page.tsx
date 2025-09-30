"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSupabaseVideos } from '@/hooks/useSupabase';
import { VideoRecord } from '@/lib/supabase';

export default function Portfolio() {
  const [portfolioVideos, setPortfolioVideos] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'snaps'>('videos');
  const [showMoreVideos, setShowMoreVideos] = useState(false);
  const [showMoreSnaps, setShowMoreSnaps] = useState(false);
  const { getVideos } = useSupabaseVideos();

  // Sample photos data - in production this would come from Supabase
  const samplePhotos = [
    { id: 1, name: "Golden Hour Romance", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800" },
    { id: 2, name: "First Dance Magic", url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800" },
    { id: 3, name: "Ceremony Bliss", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800" },
    { id: 4, name: "Bridal Portrait", url: "https://images.unsplash.com/photo-1594736797933-d0d62cec71b8?w=800" },
    { id: 5, name: "Ring Exchange", url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800" },
    { id: 6, name: "Reception Joy", url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800" },
    { id: 7, name: "Couple's Portrait", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800" },
    { id: 8, name: "Wedding Details", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800" },
    { id: 9, name: "Sunset Romance", url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800" },
    { id: 10, name: "Celebration Dance", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800" },
    { id: 11, name: "Intimate Moments", url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800" },
    { id: 12, name: "Venue Beauty", url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800" },
    { id: 13, name: "Bridal Details", url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800" },
    { id: 14, name: "Garden Ceremony", url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800" },
    { id: 15, name: "Evening Reception", url: "https://images.unsplash.com/photo-1519167758481-83f29c732152?w=800" },
    { id: 16, name: "Romantic Kiss", url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800" },
  ];
  
  useEffect(() => {
    loadVideos();
  }, []);
  
  const loadVideos = async () => {
    try {
      setLoading(true);
      const portfolioData = await getVideos('portfolio');
      setPortfolioVideos(portfolioData);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayVideos = () => {
    return showMoreVideos ? portfolioVideos : portfolioVideos.slice(0, 8);
  };

  const getDisplayPhotos = () => {
    return showMoreSnaps ? samplePhotos : samplePhotos.slice(0, 8);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6 tracking-wide">
            PORTFOLIO
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Every frame tells a story, every story becomes a legacy
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <div className="flex bg-slate-700/50 rounded-full p-1 mt-8">
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'videos'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                🎬 Films
              </button>
              <button
                onClick={() => setActiveTab('snaps')}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'snaps'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {getDisplayVideos().map((video) => (
                      <div 
                        key={video.id} 
                        className="group cursor-pointer"
                        onClick={() => setSelectedVideo(video)}
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

                  {portfolioVideos.length > 8 && (
                    <div className="text-center">
                      <button
                        onClick={() => setShowMoreVideos(!showMoreVideos)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-300"
                      >
                        {showMoreVideos ? 'Show Less' : `View ${portfolioVideos.length - 8} More Films`}
                      </button>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {getDisplayPhotos().map((photo) => (
                  <div 
                    key={photo.id} 
                    className="group cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="relative aspect-[4/5] bg-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                      <img 
                        src={photo.url} 
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

              {samplePhotos.length > 8 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowMoreSnaps(!showMoreSnaps)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-300"
                  >
                    {showMoreSnaps ? 'Show Less' : `View ${samplePhotos.length - 8} More Snaps`}
                  </button>
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
                <h3 className="text-2xl font-semibold text-white mb-2">{selectedVideo.name}</h3>
                <p className="text-gray-300">
                  Created {new Date(selectedVideo.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
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
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3]">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-white mb-2">{selectedPhoto.name}</h3>
                <p className="text-gray-300">Professional wedding photography</p>
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
          <a 
            href="/#contact" 
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            Get In Touch
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-light mb-2 tracking-wide">FILMS BY WADSON</h3>
              <p className="text-gray-400">Creating beautiful wedding memories</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Footer />
    </div>
  );
}