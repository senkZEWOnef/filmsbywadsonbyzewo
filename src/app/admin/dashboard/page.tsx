"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseVideos, useSupabaseCalendar, useSupabaseBookings, useSupabaseContactForms, useSupabaseCallbacks } from '@/hooks/useSupabase';
import { VideoRecord, BookingRecord, CalendarRecord, ContactFormRecord, CallbackRequest } from '@/lib/supabase';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [calendarData, setCalendarData] = useState<{[key: string]: string}>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateStatus, setDateStatus] = useState<string>("available");
  const [portfolioVideos, setPortfolioVideos] = useState<VideoRecord[]>([]);
  const [heroVideo, setHeroVideo] = useState<VideoRecord | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [contactForms, setContactForms] = useState<ContactFormRecord[]>([]);
  const [callbackRequests, setCallbackRequests] = useState<CallbackRequest[]>([]);
  const router = useRouter();

  // Supabase hooks
  const { uploadVideo, getVideos, deleteVideo, updateVideoName, loading: videoLoading, error: videoError } = useSupabaseVideos();
  const { updateCalendarDate, getCalendarData, loading: calendarLoading, error: calendarError } = useSupabaseCalendar();
  const { getBookings, updateBookingStatus, deleteBooking, loading: bookingLoading, error: bookingError } = useSupabaseBookings();
  const { getContactForms, updateContactFormStatus, loading: contactFormLoading, error: contactFormError } = useSupabaseContactForms();
  const { getCallbackRequests, updateCallbackStatus, deleteCallbackRequest, loading: callbackLoading, error: callbackError } = useSupabaseCallbacks();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin");
      return;
    }

    // Load data from Supabase
    loadInitialData();
  }, [router]);

  const loadInitialData = async () => {
    try {
      // Load portfolio videos
      const portfolioData = await getVideos('portfolio');
      setPortfolioVideos(portfolioData);

      // Load hero video
      const heroData = await getVideos('hero');
      if (heroData.length > 0) {
        setHeroVideo(heroData[0]); // Use the most recent hero video
      }

      // Load calendar data
      const calendarRecords = await getCalendarData();
      const calendarMap: {[key: string]: string} = {};
      calendarRecords.forEach(record => {
        calendarMap[record.date] = record.status;
      });
      setCalendarData(calendarMap);

      // Load bookings
      const bookingData = await getBookings();
      setBookings(bookingData);

      // Load contact forms
      const contactFormData = await getContactForms();
      setContactForms(contactFormData);

      // Load callback requests
      const callbackData = await getCallbackRequests();
      setCallbackRequests(callbackData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin");
  };

  const handleUpdateCalendarDate = async () => {
    if (!selectedDate) return;
    
    try {
      await updateCalendarDate(selectedDate, dateStatus);
      
      const newCalendarData = {
        ...calendarData,
        [selectedDate]: dateStatus
      };
      
      setCalendarData(newCalendarData);
      setSelectedDate("");
    } catch (error) {
      console.error('Error updating calendar date:', error);
    }
  };

  const handlePortfolioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      for (const file of Array.from(files)) {
        const uploadedVideo = await uploadVideo(file, 'portfolio');
        setPortfolioVideos(prev => [...prev, uploadedVideo]);
      }
    } catch (error) {
      console.error('Error uploading portfolio videos:', error);
      alert('Failed to upload videos. Please try again.');
    }
    
    // Reset the input
    event.target.value = '';
  };

  const handleHeroVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadedVideo = await uploadVideo(file, 'hero');
      setHeroVideo(uploadedVideo);
    } catch (error) {
      console.error('Error uploading hero video:', error);
      alert('Failed to upload hero video. Please try again.');
    }
    
    // Reset the input
    event.target.value = '';
  };

  const handleDeletePortfolioVideo = async (id: string, filePath: string) => {
    try {
      await deleteVideo(id, filePath);
      setPortfolioVideos(prev => prev.filter(video => video.id !== id));
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video. Please try again.');
    }
  };

  const handleEditPortfolioVideo = async (id: string, newName: string) => {
    try {
      await updateVideoName(id, newName);
      setPortfolioVideos(prev => 
        prev.map(video => 
          video.id === id ? { ...video, name: newName } : video
        )
      );
    } catch (error) {
      console.error('Error updating video name:', error);
      alert('Failed to update video name. Please try again.');
    }
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split('T')[0];
      const status = calendarData[dateString] || "available";
      const isPast = date < today;
      
      days.push({
        day,
        date: dateString,
        status: isPast ? "past" : status,
        isPast
      });
    }
    
    return days;
  };

  // Analytics data from Supabase
  const analytics = {
    totalInquiries: contactForms.length,
    bookingsThisMonth: contactForms.filter(cf => {
      const formDate = new Date(cf.created_at);
      const now = new Date();
      return formDate.getMonth() === now.getMonth() && formDate.getFullYear() === now.getFullYear();
    }).length,
    portfolioViews: 1247, // This would be tracked separately
    contactFormSubmissions: contactForms.filter(cf => cf.status === 'new').length
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  const currentMonthName = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-slate-800 shadow-xl">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">FW</span>
            </div>
            <div>
              <h1 className="text-lg font-light text-white">Films by Wadson</h1>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-2">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "bookings", label: "Bookings", icon: "📋" },
            { id: "calendar", label: "Calendar", icon: "📅" },
            { id: "portfolio", label: "Portfolio", icon: "🎬" },
            { id: "hero-video", label: "Hero Video", icon: "🎥" },
            { id: "inquiries", label: "Messages", icon: "💬" },
            { id: "callbacks", label: "Callbacks", icon: "📞" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-700">
          <div className="space-y-2">
            <a 
              href="/" 
              target="_blank"
              className="w-full flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="text-sm">View Site</span>
            </a>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light text-white mb-2">Welcome back, Wadson</h2>
              <p className="text-slate-300">Here&apos;s what&apos;s happening with your business today.</p>
            </div>
            
            {/* Modern Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Inquiries", value: analytics.totalInquiries, icon: "💬", color: "from-blue-500 to-blue-600" },
                { title: "This Month", value: analytics.bookingsThisMonth, icon: "📅", color: "from-green-500 to-green-600" },
                { title: "Portfolio Views", value: analytics.portfolioViews, icon: "👁️", color: "from-purple-500 to-purple-600" },
                { title: "Form Submissions", value: analytics.contactFormSubmissions, icon: "📝", color: "from-pink-500 to-pink-600" },
              ].map((card, index) => (
                <div key={index} className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300 text-sm font-medium">{card.title}</p>
                      <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-slate-700/50">
              <div className="p-6 border-b border-slate-700/50">
                <h3 className="text-xl font-semibold text-white">Recent Inquiries</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {contactForms.slice(0, 5).map((inquiry) => (
                    <div key={inquiry.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {inquiry.name.split(' ')[0][0]}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{inquiry.name}</p>
                          <p className="text-sm text-slate-300">{inquiry.email || inquiry.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-300">{inquiry.wedding_date || 'No date'}</p>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          inquiry.status === "converted" 
                            ? "bg-green-100 text-green-800" 
                            : inquiry.status === "contacted"
                            ? "bg-blue-100 text-blue-800"
                            : inquiry.status === "new"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {inquiry.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {contactForms.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-slate-400">No inquiries yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Management Tab */}
        {activeTab === "calendar" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light text-white mb-2">Calendar Management</h2>
              <p className="text-slate-300">Manage your availability and bookings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar Controls */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 space-y-6">
                  <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">Select Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
                      <select
                        value={dateStatus}
                        onChange={(e) => setDateStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="available">Available</option>
                        <option value="booked">Booked</option>
                        <option value="blocked">Day Off</option>
                        <option value="tentative">Tentative</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={handleUpdateCalendarDate}
                      disabled={!selectedDate || calendarLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {calendarLoading ? 'Updating...' : 'Update Date'}
                    </button>
                  </div>

                  {/* Legend */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-200">Legend</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-sm text-slate-300">Available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-sm text-slate-300">Booked</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-slate-500 rounded"></div>
                        <span className="text-sm text-slate-300">Day Off</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span className="text-sm text-slate-300">Tentative</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="lg:col-span-2">
                <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white">{currentMonthName} {currentYear}</h3>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {/* Day headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center font-semibold text-slate-300 py-2 text-sm">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {calendarDays.map((dayData, index) => (
                      <div key={index} className="aspect-square p-1">
                        {dayData ? (
                          <button
                            onClick={() => setSelectedDate(dayData.date)}
                            className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                              dayData.isPast
                                ? 'text-slate-500 cursor-not-allowed bg-slate-700'
                                : dayData.status === 'available'
                                ? 'bg-green-600 text-white hover:bg-green-500'
                                : dayData.status === 'booked'
                                ? 'bg-red-600 text-white hover:bg-red-500'
                                : dayData.status === 'blocked'
                                ? 'bg-slate-600 text-white hover:bg-slate-500'
                                : dayData.status === 'tentative'
                                ? 'bg-yellow-600 text-white hover:bg-yellow-500'
                                : 'bg-slate-700 hover:bg-slate-600 text-white'
                            } ${
                              selectedDate === dayData.date ? 'ring-2 ring-purple-400' : ''
                            }`}
                            disabled={dayData.isPast}
                          >
                            {dayData.day}
                          </button>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-light text-white mb-2">Booking Management</h2>
                <p className="text-slate-300">Manage booking requests and confirmed bookings.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Total: {bookings.length}</p>
                <p className="text-sm text-slate-400">Pending: {bookings.filter(b => b.status === 'pending').length}</p>
              </div>
            </div>

            {bookingError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm">{bookingError}</p>
              </div>
            )}

            <div className="grid gap-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {booking.client_name.split(' ')[0][0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-1">{booking.client_name}</h3>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-300 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {booking.email}
                          </p>
                          <p className="text-sm text-slate-300 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {booking.phone}
                          </p>
                          <p className="text-sm text-slate-300 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6 0h6" />
                            </svg>
                            Wedding Date: {booking.wedding_date}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center mt-2">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Submitted: {new Date(booking.created_at).toLocaleDateString()} at {new Date(booking.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        booking.status === "confirmed" 
                          ? "bg-green-100 text-green-800" 
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  
                  {booking.message && (
                    <div className="mb-4 p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Wedding Details:</h4>
                      <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                        {booking.message}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-3">
                    {booking.email && (
                      <a 
                        href={`mailto:${booking.email}?subject=Re: Wedding Booking Request - ${booking.wedding_date}&body=Hi ${booking.client_name},%0D%0A%0D%0AThank you for your booking request for ${booking.wedding_date}...`}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Email</span>
                      </a>
                    )}
                    <a 
                      href={`tel:${booking.phone}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Call</span>
                    </a>
                    
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              await updateBookingStatus(booking.id, 'confirmed');
                              setBookings(prev => prev.map(b => 
                                b.id === booking.id ? { ...b, status: 'confirmed' } : b
                              ));
                            } catch (error) {
                              console.error('Error updating booking status:', error);
                              alert('Failed to update booking status. Please try again.');
                            }
                          }}
                          disabled={bookingLoading}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await updateBookingStatus(booking.id, 'declined');
                              setBookings(prev => prev.map(b => 
                                b.id === booking.id ? { ...b, status: 'declined' } : b
                              ));
                            } catch (error) {
                              console.error('Error updating booking status:', error);
                              alert('Failed to update booking status. Please try again.');
                            }
                          }}
                          disabled={bookingLoading}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Decline</span>
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={async () => {
                        if (confirm(`Are you sure you want to delete the booking request from ${booking.client_name}? This action cannot be undone.`)) {
                          try {
                            await deleteBooking(booking.id);
                            setBookings(prev => prev.filter(b => b.id !== booking.id));
                          } catch (error) {
                            console.error('Error deleting booking:', error);
                            alert('Failed to delete booking. Please try again.');
                          }
                        }
                      }}
                      disabled={bookingLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {bookings.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Booking Requests</h3>
                  <p className="text-slate-400">Booking requests will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages/Inquiries Tab */}
        {activeTab === "inquiries" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-light text-white mb-2">Contact Messages</h2>
                <p className="text-slate-300">View and respond to client inquiries from your website.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Total: {contactForms.length}</p>
                <p className="text-sm text-slate-400">New: {contactForms.filter(cf => cf.status === 'new').length}</p>
              </div>
            </div>

            {contactFormError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm">{contactFormError}</p>
              </div>
            )}

            <div className="grid gap-6">
              {contactForms.map((inquiry) => (
                <div key={inquiry.id} className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {inquiry.name.split(' ')[0][0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{inquiry.name}</h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-slate-300 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {inquiry.phone}
                          </p>
                          {inquiry.email && (
                            <p className="text-sm text-slate-300 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {inquiry.email}
                            </p>
                          )}
                          {inquiry.wedding_date && (
                            <p className="text-sm text-slate-300 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6 0h6" />
                              </svg>
                              Wedding: {inquiry.wedding_date}
                            </p>
                          )}
                          {inquiry.venue && (
                            <p className="text-sm text-slate-300 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Venue: {inquiry.venue}
                            </p>
                          )}
                          <p className="text-xs text-slate-400 flex items-center mt-2">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(inquiry.created_at).toLocaleDateString()} at {new Date(inquiry.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        inquiry.status === "converted" 
                          ? "bg-green-100 text-green-800" 
                          : inquiry.status === "contacted"
                          ? "bg-blue-100 text-blue-800"
                          : inquiry.status === "new"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>
                  </div>
                  
                  {inquiry.message && (
                    <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-200 text-sm leading-relaxed">
                        &quot;{inquiry.message}&quot;
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex space-x-3">
                    {inquiry.email && (
                      <a 
                        href={`mailto:${inquiry.email}?subject=Re: Wedding Film Inquiry&body=Hi ${inquiry.name},%0D%0A%0D%0AThank you for your interest in Films by Wadson...`}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Reply via Email</span>
                      </a>
                    )}
                    <a 
                      href={`tel:${inquiry.phone}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Call</span>
                    </a>
                    <select
                      value={inquiry.status}
                      onChange={(e) => updateContactFormStatus(inquiry.id, e.target.value as ContactFormRecord['status'])}
                      className="px-3 py-2 bg-slate-600 text-white rounded-lg text-sm border border-slate-500 focus:ring-2 focus:ring-purple-500"
                      disabled={contactFormLoading}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>
              ))}
              
              {contactForms.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Messages Yet</h3>
                  <p className="text-slate-400">Contact form submissions will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-light text-white mb-2">Portfolio Management</h2>
                <p className="text-slate-300">Upload and manage your wedding film portfolio.</p>
              </div>
              <label 
                htmlFor="video-upload" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Upload Video</span>
              </label>
            </div>
            
            {/* Error Display */}
            {(videoError || calendarError || bookingError) && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                <p className="text-red-400 text-sm">
                  {videoError || calendarError || bookingError}
                </p>
              </div>
            )}
            
            <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-purple-400 transition-colors">
                <div className="text-6xl mb-6">🎬</div>
                <h3 className="text-xl font-semibold text-white mb-2">Upload Wedding Videos</h3>
                <p className="text-slate-300 mb-6">Drag and drop video files or click to browse</p>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  className="hidden"
                  id="video-upload"
                  onChange={handlePortfolioUpload}
                  disabled={videoLoading}
                />
                <label
                  htmlFor="video-upload"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Choose Videos</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioVideos.map((video) => (
                <div key={video.id} className="bg-slate-800/80 backdrop-blur-lg rounded-2xl overflow-hidden border border-slate-700/50 hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden">
                    {video.file_path ? (
                      <video 
                        src={video.file_path} 
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-6">
                    <input
                      type="text"
                      value={video.name}
                      onChange={(e) => handleEditPortfolioVideo(video.id, e.target.value)}
                      className="text-lg font-semibold text-white mb-2 bg-transparent border-none outline-none w-full"
                    />
                    <p className="text-slate-300 text-sm mb-4">
                      Beautiful cinematic story
                    </p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          const newName = prompt('Enter new name:', video.name);
                          if (newName) handleEditPortfolioVideo(video.id, newName);
                        }}
                        className="flex-1 text-blue-400 hover:text-blue-300 text-sm font-medium py-2 px-3 border border-blue-500 rounded-lg hover:bg-blue-500/10 transition-colors"
                        disabled={videoLoading}
                      >
                        Rename
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this video?')) {
                            handleDeletePortfolioVideo(video.id, video.file_path);
                          }
                        }}
                        className="flex-1 text-red-400 hover:text-red-300 text-sm font-medium py-2 px-3 border border-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                        disabled={videoLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hero Video Tab */}
        {activeTab === "hero-video" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light text-white mb-2">Hero Video Management</h2>
              <p className="text-slate-300">Update the background video on your homepage.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Current Hero Video</h3>
                <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center mb-6">
                  {heroVideo ? (
                    <video 
                      src={heroVideo.file_path} 
                      className="w-full h-full object-cover rounded-xl"
                      controls
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎥</div>
                      <span className="text-slate-600">No hero video uploaded</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Preview
                  </button>
                  <button className="flex-1 py-2 px-4 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">
                    Download
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Upload New Video</h3>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                  <div className="text-4xl mb-4">📹</div>
                  <h4 className="text-lg font-medium text-white mb-2">Replace Hero Video</h4>
                  <p className="text-slate-300 mb-4 text-sm">Upload a new background video for your homepage</p>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    id="hero-video-upload"
                    onChange={handleHeroVideoUpload}
                  />
                  <label
                    htmlFor="hero-video-upload"
                    className={`inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 ${videoLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>{videoLoading ? 'Uploading...' : 'Choose Video'}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Callbacks Tab */}
        {activeTab === "callbacks" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-light text-white mb-2">Phone Callback Requests</h2>
                <p className="text-slate-300">Manage client callback requests from the contact page.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Total: {callbackRequests.length}</p>
                <p className="text-sm text-slate-400">Pending: {callbackRequests.filter(cb => cb.status === 'pending').length}</p>
              </div>
            </div>

            {callbackError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm">{callbackError}</p>
              </div>
            )}

            <div className="grid gap-6">
              {callbackRequests.map((callback) => (
                <div key={callback.id} className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{callback.name}</h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-slate-300 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {callback.phone}
                          </p>
                          {callback.best_time && (
                            <p className="text-sm text-slate-300 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Best time: {callback.best_time}
                            </p>
                          )}
                          <p className="text-xs text-slate-400 flex items-center mt-2">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Requested: {new Date(callback.created_at).toLocaleDateString()} at {new Date(callback.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        callback.status === "completed" 
                          ? "bg-green-100 text-green-800" 
                          : callback.status === "called"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {callback.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a 
                      href={`tel:${callback.phone}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Call Now</span>
                    </a>
                    
                    {callback.status === 'pending' && (
                      <button
                        onClick={async () => {
                          try {
                            await updateCallbackStatus(callback.id, 'called');
                            setCallbackRequests(prev => prev.map(cb => 
                              cb.id === callback.id ? { ...cb, status: 'called' } : cb
                            ));
                          } catch (error) {
                            console.error('Error updating callback status:', error);
                            alert('Failed to update status. Please try again.');
                          }
                        }}
                        disabled={callbackLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Mark Called</span>
                      </button>
                    )}
                    
                    {callback.status === 'called' && (
                      <button
                        onClick={async () => {
                          try {
                            await updateCallbackStatus(callback.id, 'completed');
                            setCallbackRequests(prev => prev.map(cb => 
                              cb.id === callback.id ? { ...cb, status: 'completed' } : cb
                            ));
                          } catch (error) {
                            console.error('Error updating callback status:', error);
                            alert('Failed to update status. Please try again.');
                          }
                        }}
                        disabled={callbackLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Mark Completed</span>
                      </button>
                    )}
                    
                    <button
                      onClick={async () => {
                        if (confirm(`Are you sure you want to delete the callback request from ${callback.name}? This action cannot be undone.`)) {
                          try {
                            await deleteCallbackRequest(callback.id);
                            setCallbackRequests(prev => prev.filter(cb => cb.id !== callback.id));
                          } catch (error) {
                            console.error('Error deleting callback:', error);
                            alert('Failed to delete callback request. Please try again.');
                          }
                        }
                      }}
                      disabled={callbackLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {callbackRequests.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📞</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Callback Requests</h3>
                  <p className="text-slate-400">Phone callback requests will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}