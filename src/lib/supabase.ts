import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type VideoRecord = {
  id: string;
  name: string;
  file_path: string;
  video_type: 'portfolio' | 'hero';
  created_at: string;
  updated_at: string;
};

export type BookingRecord = {
  id: string;
  client_name: string;
  email: string;
  phone: string;
  wedding_date: string;
  status: 'pending' | 'confirmed' | 'declined';
  message?: string;
  created_at: string;
};

export type CalendarRecord = {
  id: string;
  date: string;
  status: 'available' | 'booked' | 'blocked' | 'tentative';
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type ContactFormRecord = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  wedding_date?: string;
  venue?: string;
  message?: string;
  status: 'new' | 'contacted' | 'converted' | 'declined';
  created_at: string;
};

export type CallbackRequest = {
  id: string;
  name: string;
  phone: string;
  best_time?: string;
  status: 'pending' | 'called' | 'completed';
  created_at: string;
};