"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AvailabilitySection from "@/components/AvailabilitySection";
import { useSupabaseVideos, useSupabaseContactForms } from '@/hooks/useSupabase';
import { VideoRecord } from '@/lib/supabase';

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    venue: "",
    message: "",
  });
  
  const [portfolioVideos, setPortfolioVideos] = useState<VideoRecord[]>([]);
  const [heroVideo, setHeroVideo] = useState<VideoRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getVideos } = useSupabaseVideos();
  const { submitContactForm, loading: formLoading } = useSupabaseContactForms();
  
  useEffect(() => {
    loadVideos();
  }, []);
  
  const loadVideos = async () => {
    try {
      const portfolioData = await getVideos('portfolio');
      setPortfolioVideos(portfolioData.slice(0, 3)); // Show only first 3
      
      const heroData = await getVideos('hero');
      if (heroData.length > 0) {
        setHeroVideo(heroData[0]);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      alert('Please fill in required fields: Name and Phone');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitContactForm({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        wedding_date: formData.date || undefined,
        venue: formData.venue || undefined,
        message: formData.message || undefined
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        venue: "",
        message: "",
      });
      
      alert('Thank you! Your message has been sent successfully. We\'ll get back to you soon!');
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Sorry, there was an error sending your message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 20%' }}
        >
          <source src={heroVideo?.file_path || "/hero.MP4"} type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
        </video>
        
        {/* Elegant overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Hero Content - Inspired by cinematic elegance */}
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-wide mb-4 sm:mb-6 text-white leading-tight drop-shadow-2xl whitespace-nowrap">
              <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                FILMS BY WADSON
              </span>
            </h1>
            <div className="w-20 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent mx-auto mb-6 sm:mb-8 shadow-lg"></div>
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-wide leading-relaxed max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
            <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg italic">
              "We bottle the spell of your wedding and let it live on"
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a 
              href="#contact" 
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-wide"
            >
              BOOK NOW
            </a>
            <a 
              href="/portfolio" 
              className="inline-block border-2 border-white/80 hover:border-white text-white hover:bg-white hover:text-slate-900 font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg tracking-wide"
            >
              PORTFOLIO
            </a>
          </div>
          
          <div className="mt-16 flex justify-center">
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-slate-800 tracking-wide mb-6">
              CATCH A GLIMPSE OF OUR ARTISTRY
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-6 italic leading-relaxed">
              We turn a single day into a myth you can return to.
            </p>
            <a 
              href="/portfolio" 
              className="inline-block text-purple-600 hover:text-purple-800 transition-colors duration-300 text-lg font-light tracking-wide"
            >
              Discover Our Complete Collection →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {portfolioVideos.length > 0 ? (
              portfolioVideos.map((video) => (
                <a 
                  key={video.id} 
                  href="/portfolio"
                  className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300 block"
                >
                  <div className="aspect-video bg-slate-200 relative overflow-hidden">
                    <video 
                      src={video.file_path} 
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                    <div className="absolute bottom-4 right-4">
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-4 h-4 text-slate-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{video.name}</h3>
                    <p className="text-gray-600">Beautiful cinematic wedding story</p>
                  </div>
                </a>
              ))
            ) : (
              // Fallback to placeholders if no videos uploaded yet
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Wedding Film {i}</h3>
                    <p className="text-gray-600">Beautiful moments captured in cinematic style</p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-center mb-8 sm:mb-12 lg:mb-16 text-slate-800 tracking-wide">
            OUR SERVICES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            <div className="text-center bg-white/60 backdrop-blur-lg rounded-lg p-6 border border-amber-200/50 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-800">Full Day Coverage</h3>
              <p className="text-slate-600">From getting ready to reception, we capture every moment</p>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-lg rounded-lg p-6 border border-amber-200/50 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-800">Cinematic Quality</h3>
              <p className="text-slate-600">Professional equipment and expert editing for stunning results</p>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-lg rounded-lg p-6 border border-amber-200/50 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-800">Quick Delivery</h3>
              <p className="text-slate-600">Receive your beautiful 10-15 minute film within 4-6 weeks</p>
            </div>
          </div>
          
          {/* Booking CTA */}
          <div className="text-center">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-amber-200/50 shadow-xl max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-light text-slate-800 mb-4 tracking-wide">
                Ready to Create Your Story?
              </h3>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                Let's capture the magic of your special day and turn it into a cinematic masterpiece you'll treasure forever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="#contact" 
                  className="inline-block bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-wide"
                >
                  BOOK NOW
                </a>
                <a 
                  href="/portfolio" 
                  className="inline-block border-2 border-amber-400 hover:border-amber-500 text-amber-700 hover:bg-amber-500 hover:text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg tracking-wide"
                >
                  VIEW PORTFOLIO
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Availability & Contact Merged Section */}
      <section id="contact" className="relative py-12 sm:py-16 lg:py-20 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/option1.jpg)'}}>
        {/* Background overlay for better readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide mb-4">
              LETS CREATE MAGIC TOGETHER
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto italic">
              Check our availability and get in touch to secure your perfect wedding date
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Availability Section - Left Side */}
            <div className="bg-slate-800/85 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/30">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-light text-white mb-2 tracking-wide">
                  CHECK AVAILABILITY
                </h3>
                <p className="text-gray-300 text-sm">Select a date to see if we're available</p>
              </div>
              
              {/* Simplified Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-medium text-gray-300 py-2 text-xs">
                    {day}
                  </div>
                ))}
                
                {/* Sample calendar days */}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 5; // Start from day -5 to show proper calendar layout
                  const isCurrentMonth = day > 0 && day <= 31;
                  const isBooked = [5, 12, 18, 25].includes(day);
                  const isPast = day < new Date().getDate();
                  const isAvailable = isCurrentMonth && !isBooked && !isPast;
                  
                  return (
                    <div key={i} className="aspect-square p-0.5">
                      {isCurrentMonth ? (
                        <button
                          className={`w-full h-full rounded text-xs font-medium transition-all ${
                            isPast
                              ? 'text-gray-400 cursor-not-allowed'
                              : isBooked
                              ? 'bg-red-100 text-red-600 cursor-not-allowed'
                              : isAvailable
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'
                              : ''
                          }`}
                          disabled={isPast || isBooked}
                        >
                          {day}
                        </button>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="flex justify-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-100 rounded"></div>
                  <span className="text-xs text-gray-300">Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-100 rounded"></div>
                  <span className="text-xs text-gray-300">Booked</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-3">
                  Peak season dates fill up quickly!
                </p>
                <a 
                  href="#contact-form" 
                  className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-sm"
                >
                  Secure Your Date →
                </a>
              </div>
            </div>
            
            {/* Contact Form - Right Side */}
            <div id="contact-form" className="bg-slate-800/85 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/30">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-light text-white mb-2 tracking-wide">
                  GET IN TOUCH
                </h3>
                <p className="text-gray-300 text-sm">Tell us about your special day</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-600 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-600 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-sm"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-600 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                      Wedding Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-600 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-sm"
                    placeholder="Wedding venue location"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-slate-700/50 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-sm"
                    placeholder="Tell us about your wedding..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || formLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || formLoading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Intertwined Element */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">Available dates filling fast</span>
              </div>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-white text-sm font-medium">Response within 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media & Footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-10 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-light mb-2 tracking-wide">FILMS BY WADSON</h3>
              <p className="text-gray-400 text-sm sm:text-base">Creating beautiful wedding memories</p>
            </div>
            <div className="flex space-x-4 sm:space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z"/>
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
