"use client";

import { useState, useCallback } from 'react';
import { VideoRecord, VideoType, BookingRecord, CalendarRecord, ContactFormRecord, CallbackRequest, PhotoRecord } from '@/lib/database';

export const useSupabaseVideos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createVideo = useCallback(async (name: string, filePath: string, videoType: VideoType) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, filePath, videoType })
      });

      if (!response.ok) {
        throw new Error('Failed to create video');
      }

      return await response.json() as VideoRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video creation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getVideos = useCallback(async (videoType?: VideoType) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = '/api/videos';
      if (videoType) {
        url += `?type=${videoType}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      return await response.json() as VideoRecord[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVideo = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/videos?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete video');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVideoName = async (id: string, newName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: newName })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update video');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createVideo,
    getVideos,
    deleteVideo,
    updateVideoName,
    loading,
    error
  };
};

export const useSupabaseCalendar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCalendarDate = useCallback(async (date: string, status: string, notes?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, status, notes })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update calendar');
      }
      
      return await response.json() as CalendarRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calendar update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCalendarData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/calendar');
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar data');
      }
      
      return await response.json() as CalendarRecord[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateCalendarDate,
    getCalendarData,
    loading,
    error
  };
};

export const useSupabaseBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (booking: Omit<BookingRecord, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      
      return await response.json() as BookingRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking creation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      return await response.json() as BookingRecord[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBookingStatus = async (id: string, status: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/bookings?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    getBookings,
    updateBookingStatus,
    deleteBooking,
    loading,
    error
  };
};

export const useSupabaseContactForms = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContactForm = async (formData: Omit<ContactFormRecord, 'id' | 'created_at' | 'status'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/contact-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }
      
      return await response.json() as ContactFormRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Form submission failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getContactForms = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/contact-forms');
      
      if (!response.ok) {
        throw new Error('Failed to fetch contact forms');
      }
      
      return await response.json() as ContactFormRecord[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contact forms');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContactFormStatus = async (id: string, status: ContactFormRecord['status']) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/contact-forms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update contact form status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitContactForm,
    getContactForms,
    updateContactFormStatus,
    loading,
    error
  };
};

export const useSupabaseCallbacks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitCallbackRequest = async (formData: Omit<CallbackRequest, 'id' | 'created_at' | 'status'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/callback-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit callback request');
      }
      
      return await response.json() as CallbackRequest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Callback request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCallbackRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/callback-requests');
      
      if (!response.ok) {
        throw new Error('Failed to fetch callback requests');
      }
      
      return await response.json() as CallbackRequest[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch callback requests');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCallbackStatus = async (id: string, status: CallbackRequest['status']) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/callback-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update callback status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCallbackRequest = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/callback-requests?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete callback request');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitCallbackRequest,
    getCallbackRequests,
    updateCallbackStatus,
    deleteCallbackRequest,
    loading,
    error
  };
};

export const useSupabasePhotos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPhoto = async (name: string, filePath: string, category: 'portfolio' | 'featured' = 'portfolio', description?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, filePath, category, description })
      });

      if (!response.ok) {
        throw new Error('Failed to create photo');
      }

      return await response.json() as PhotoRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Photo creation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPhotos = useCallback(async (category?: 'portfolio' | 'featured') => {
    setLoading(true);
    setError(null);
    
    try {
      let url = '/api/photos';
      if (category) {
        url += `?category=${category}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      
      return await response.json() as PhotoRecord[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch photos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePhoto = async (id: string, name: string, description?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, description })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update photo');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/photos?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPhoto,
    getPhotos,
    updatePhoto,
    deletePhoto,
    loading,
    error
  };
};