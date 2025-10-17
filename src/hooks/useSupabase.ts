"use client";

import { useState } from 'react';
import { supabase, VideoRecord, BookingRecord, CalendarRecord, ContactFormRecord, CallbackRequest } from '@/lib/supabase';

export const useSupabaseVideos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadVideo = async (file: File, videoType: 'portfolio' | 'hero', name?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${videoType}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      // Save video record to database
      const { data, error: dbError } = await supabase
        .from('videos')
        .insert({
          name: name || file.name,
          file_path: publicUrl,
          video_type: videoType,
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      return data as VideoRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getVideos = async (videoType?: 'portfolio' | 'hero') => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('videos').select('*');
      
      if (videoType) {
        query = query.eq('video_type', videoType);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as VideoRecord[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (id: string, filePath: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Extract file path from URL for storage deletion
      const urlParts = filePath.split('/');
      const storageFilePath = urlParts.slice(-2).join('/'); // Get 'portfolio/filename.mp4' or 'hero/filename.mp4'
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove([storageFilePath]);

      if (storageError) {
        console.warn('Storage deletion error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (dbError) {
        throw dbError;
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
      const { error } = await supabase
        .from('videos')
        .update({ name: newName, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadVideo,
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

  const updateCalendarDate = async (date: string, status: string, notes?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('calendar')
        .upsert({
          date,
          status,
          notes,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as CalendarRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calendar update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCalendarData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('calendar')
        .select('*');

      if (error) {
        throw error;
      }

      return data as CalendarRecord[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
      const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as BookingRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking creation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as BookingRecord[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw error;
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
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
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
      const { data, error } = await supabase
        .from('contact_forms')
        .insert({
          ...formData,
          status: 'new'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as ContactFormRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Form submission failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getContactForms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('contact_forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as ContactFormRecord[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contact forms');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContactFormStatus = async (id: string, status: ContactFormRecord['status']) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('contact_forms')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw error;
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
      const { data, error } = await supabase
        .from('callback_requests')
        .insert({
          ...formData,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as CallbackRequest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Callback request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCallbackRequests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('callback_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as CallbackRequest[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch callback requests');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCallbackStatus = async (id: string, status: CallbackRequest['status']) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('callback_requests')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw error;
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
      const { error } = await supabase
        .from('callback_requests')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
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