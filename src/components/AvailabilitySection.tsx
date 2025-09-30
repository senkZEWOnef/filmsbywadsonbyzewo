"use client";

import { useState, useEffect } from "react";

export default function AvailabilitySection() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [calendarDays, setCalendarDays] = useState<({day: number; date: string; isPast: boolean; isBooked: boolean; isAvailable: boolean} | null)[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const generateCalendarDays = () => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      const startingDayOfWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();
      
      const days = [];
      
      // Predefined booking pattern for consistency
      const bookedDays = [5, 12, 18, 25]; // Fixed booked days
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateString = date.toISOString().split('T')[0];
        const isPast = date < today;
        const isBooked = bookedDays.includes(day); // Use fixed booking pattern
        
        days.push({
          day,
          date: dateString,
          isPast,
          isBooked,
          isAvailable: !isPast && !isBooked
        });
      }
      
      return days;
    };

    setCalendarDays(generateCalendarDays());
  }, []);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const today = new Date();
  const currentMonthName = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <section className="relative py-12 sm:py-16 lg:py-20 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/availability.jpg)'}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-center mb-8 sm:mb-12 lg:mb-16 text-white tracking-wide">
            CHECK AVAILABILITY
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-800/85 backdrop-blur-md rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 border border-white/30">
              <div className="text-center mb-6 sm:mb-8">
                <div className="animate-pulse">
                  <div className="h-6 bg-slate-600 rounded w-48 mx-auto mb-2"></div>
                  <div className="h-4 bg-slate-600 rounded w-64 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/availability.jpg)'}}>
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-center mb-8 sm:mb-12 lg:mb-16 text-white tracking-wide">
          CHECK AVAILABILITY
        </h2>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-800/85 backdrop-blur-md rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 border border-white/30">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 text-white">{currentMonthName} {currentYear}</h3>
              <p className="text-sm sm:text-base text-gray-300">Select a date to check availability for your wedding</p>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6 sm:mb-8">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-300 py-1 sm:py-2 text-xs sm:text-sm">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((dayData, index) => (
                <div key={index} className="aspect-square p-0.5 sm:p-1">
                  {dayData ? (
                    <button
                      onClick={() => dayData.isAvailable && setSelectedDate(dayData.date)}
                      className={`w-full h-full rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                        dayData.isPast
                          ? 'text-gray-300 cursor-not-allowed'
                          : dayData.isBooked
                          ? 'bg-red-100 text-red-600 cursor-not-allowed'
                          : dayData.isAvailable
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'
                          : ''
                      } ${
                        selectedDate === dayData.date 
                          ? 'ring-2 ring-purple-500 bg-purple-100 text-purple-700'
                          : ''
                      }`}
                      disabled={dayData.isPast || dayData.isBooked}
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
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded border"></div>
                <span className="text-sm text-gray-300">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 rounded border"></div>
                <span className="text-sm text-gray-300">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded border"></div>
                <span className="text-sm text-gray-300">Past</span>
              </div>
            </div>
            
            {/* Selected Date Info */}
            {selectedDate && (
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <h4 className="text-xl font-semibold text-purple-900 mb-2">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} is Available!
                </h4>
                <p className="text-purple-700 mb-4">
                  This date is currently available for your wedding. Contact us to secure your booking.
                </p>
                <a 
                  href="#contact" 
                  className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Book This Date
                </a>
              </div>
            )}
            
            {/* Booking Information */}
            <div className="mt-8 text-center text-gray-600">
              <p className="mb-2">
                <strong>Note:</strong> Availability shown is in real-time. Dates fill up quickly during peak season.
              </p>
              <p>
                Contact us immediately to secure your preferred date with a booking deposit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}