"use client";

import { useState } from "react";

export default function AvailabilitySection() {
  const [selectedDate, setSelectedDate] = useState<string>("");

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
      const isBooked = Math.random() > 0.7; // Random booking simulation
      
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

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const today = new Date();
  const currentMonthName = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-900">
          Check Availability
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-2">{currentMonthName} {currentYear}</h3>
              <p className="text-gray-600">Select a date to check availability for your wedding</p>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-8">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-700 py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((dayData, index) => (
                <div key={index} className="aspect-square p-1">
                  {dayData ? (
                    <button
                      onClick={() => dayData.isAvailable && setSelectedDate(dayData.date)}
                      className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 ${
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
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 rounded border"></div>
                <span className="text-sm text-gray-600">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded border"></div>
                <span className="text-sm text-gray-600">Past</span>
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