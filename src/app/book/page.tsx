"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSupabaseCalendar, useSupabaseBookings } from '@/hooks/useSupabase';
import { CalendarRecord } from '@/lib/supabase';

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [calendarData, setCalendarData] = useState<{[key: string]: string}>({});
  const [currentStep, setCurrentStep] = useState(1); // 1: Calendar, 2: Form, 3: Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    client_name: "",
    email: "",
    phone: "",
    wedding_date: "",
    venue: "",
    package: "",
    guest_count: "",
    ceremony_time: "",
    reception_time: "",
    special_requests: "",
    budget: "",
    referral_source: ""
  });

  const { getCalendarData, loading: calendarLoading } = useSupabaseCalendar();
  const { createBooking, loading: bookingLoading } = useSupabaseBookings();

  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = async () => {
    try {
      const calendarRecords = await getCalendarData();
      const calendarMap: {[key: string]: string} = {};
      calendarRecords.forEach((record: CalendarRecord) => {
        calendarMap[record.date] = record.status;
      });
      setCalendarData(calendarMap);
    } catch (error) {
      console.error('Error loading calendar data:', error);
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
      const isPast = date < today;
      const status = calendarData[dateString] || "available";
      const isAvailable = !isPast && (status === "available");
      
      days.push({
        day,
        date: dateString,
        isPast,
        status,
        isAvailable
      });
    }
    
    return days;
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setBookingData(prev => ({ ...prev, wedding_date: date }));
    setCurrentStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.client_name || !bookingData.email || !bookingData.phone || !bookingData.wedding_date) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createBooking({
        client_name: bookingData.client_name,
        email: bookingData.email,
        phone: bookingData.phone,
        wedding_date: bookingData.wedding_date,
        status: 'pending' as const,
        message: `Package: ${bookingData.package}\nVenue: ${bookingData.venue}\nGuest Count: ${bookingData.guest_count}\nCeremony: ${bookingData.ceremony_time}\nReception: ${bookingData.reception_time}\nBudget: ${bookingData.budget}\nReferral: ${bookingData.referral_source}\nSpecial Requests: ${bookingData.special_requests}`
      });
      
      setCurrentStep(3);
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Sorry, there was an error submitting your booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  const currentMonthName = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-slate-800 tracking-wide mb-6">
            BOOK YOUR PERFECT DAY
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Let's create something magical together. Select your wedding date and tell us about your special day.
          </p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              2
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-purple-600' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              3
            </div>
          </div>
          
          <div className="text-sm text-slate-500 space-x-8">
            <span className={currentStep === 1 ? 'font-medium text-purple-600' : ''}>Select Date</span>
            <span className={currentStep === 2 ? 'font-medium text-purple-600' : ''}>Wedding Details</span>
            <span className={currentStep === 3 ? 'font-medium text-purple-600' : ''}>Confirmation</span>
          </div>
        </div>
      </section>

      {/* Step 1: Calendar Selection */}
      {currentStep === 1 && (
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-2xl sm:text-3xl font-light text-slate-800 text-center mb-2">
                  Choose Your Wedding Date
                </h2>
                <p className="text-slate-600 text-center">
                  Select an available date from our calendar below
                </p>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-medium text-slate-800 mb-4">{currentMonthName} {currentYear}</h3>
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-8">
                  {/* Day headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center font-medium text-slate-500 py-3 text-sm">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {calendarDays.map((dayData, index) => (
                    <div key={index} className="aspect-square p-1">
                      {dayData ? (
                        <button
                          onClick={() => dayData.isAvailable && handleDateSelect(dayData.date)}
                          className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                            dayData.isPast
                              ? 'text-slate-300 cursor-not-allowed bg-slate-50'
                              : dayData.status === 'booked'
                              ? 'bg-red-100 text-red-600 cursor-not-allowed'
                              : dayData.status === 'blocked'
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : dayData.isAvailable
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer hover:scale-105'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                          disabled={!dayData.isAvailable}
                        >
                          {dayData.day}
                        </button>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex justify-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded border"></div>
                    <span className="text-sm text-slate-600">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 rounded border"></div>
                    <span className="text-sm text-slate-600">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-100 rounded border"></div>
                    <span className="text-sm text-slate-600">Unavailable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 2: Booking Form */}
      {currentStep === 2 && (
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-2xl sm:text-3xl font-light text-slate-800 text-center mb-2">
                  Tell Us About Your Wedding
                </h2>
                <p className="text-slate-600 text-center">
                  Selected Date: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-2 mx-auto block"
                >
                  Change Date
                </button>
              </div>
              
              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="client_name" className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="client_name"
                          name="client_name"
                          required
                          value={bookingData.client_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Bride & Groom Names"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={bookingData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={bookingData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label htmlFor="venue" className="block text-sm font-medium text-slate-700 mb-2">
                          Wedding Venue
                        </label>
                        <input
                          type="text"
                          id="venue"
                          name="venue"
                          value={bookingData.venue}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Venue name and location"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wedding Details */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Wedding Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="package" className="block text-sm font-medium text-slate-700 mb-2">
                          Preferred Package
                        </label>
                        <select
                          id="package"
                          name="package"
                          value={bookingData.package}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select a package</option>
                          <option value="essential">Essential - 6 hours coverage</option>
                          <option value="premium">Premium - 8 hours coverage</option>
                          <option value="luxury">Luxury - Full day coverage</option>
                          <option value="custom">Custom package</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="guest_count" className="block text-sm font-medium text-slate-700 mb-2">
                          Expected Guest Count
                        </label>
                        <input
                          type="number"
                          id="guest_count"
                          name="guest_count"
                          value={bookingData.guest_count}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Number of guests"
                        />
                      </div>
                      <div>
                        <label htmlFor="ceremony_time" className="block text-sm font-medium text-slate-700 mb-2">
                          Ceremony Time
                        </label>
                        <input
                          type="time"
                          id="ceremony_time"
                          name="ceremony_time"
                          value={bookingData.ceremony_time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="reception_time" className="block text-sm font-medium text-slate-700 mb-2">
                          Reception Time
                        </label>
                        <input
                          type="time"
                          id="reception_time"
                          name="reception_time"
                          value={bookingData.reception_time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                          Budget Range
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          value={bookingData.budget}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select budget range</option>
                          <option value="under-3000">Under $3,000</option>
                          <option value="3000-5000">$3,000 - $5,000</option>
                          <option value="5000-8000">$5,000 - $8,000</option>
                          <option value="8000-12000">$8,000 - $12,000</option>
                          <option value="over-12000">Over $12,000</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="referral_source" className="block text-sm font-medium text-slate-700 mb-2">
                          How did you hear about us?
                        </label>
                        <select
                          id="referral_source"
                          name="referral_source"
                          value={bookingData.referral_source}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select source</option>
                          <option value="google">Google Search</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="referral">Friend/Family Referral</option>
                          <option value="venue">Wedding Venue</option>
                          <option value="planner">Wedding Planner</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label htmlFor="special_requests" className="block text-sm font-medium text-slate-700 mb-2">
                      Special Requests or Additional Information
                    </label>
                    <textarea
                      id="special_requests"
                      name="special_requests"
                      rows={4}
                      value={bookingData.special_requests}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Tell us about any special moments you want captured, specific requests, or anything else we should know about your wedding day..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting || bookingLoading}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isSubmitting || bookingLoading ? 'Submitting Request...' : 'Submit Booking Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Confirmation */}
      {currentStep === 3 && (
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-center">
              <div className="p-8 sm:p-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-light text-slate-800 mb-4">
                  Booking Request Submitted!
                </h2>
                
                <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
                  Thank you for choosing Films by Wadson! We've received your booking request for{' '}
                  <strong>
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </strong>.
                </p>
                
                <div className="bg-purple-50 rounded-xl p-6 mb-8 text-left max-w-2xl mx-auto">
                  <h3 className="font-semibold text-slate-800 mb-3">What happens next?</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      We'll review your request within 24 hours
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      You'll receive an email confirmation with next steps
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      We'll schedule a consultation call to discuss your vision
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Upon approval, we'll send you a contract and invoice
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/" 
                    className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300"
                  >
                    Return Home
                  </a>
                  <a 
                    href="/portfolio" 
                    className="inline-block border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-300"
                  >
                    View Our Work
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}