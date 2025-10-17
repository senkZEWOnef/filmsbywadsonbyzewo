import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = pool;

export type VideoType = 'portfolio' | 'hero' | 'about_hero' | 'about_timeline_1' | 'about_timeline_2' | 'about_timeline_3' | 'about_timeline_4' | 'about_timeline_5' | 'about_timeline_6' | 'about_behind_scenes';

export type VideoRecord = {
  id: string;
  name: string;
  file_path: string;
  video_type: VideoType;
  source_type: 'upload' | 'youtube';
  youtube_url?: string;
  thumbnail_url?: string;
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

export type PhotoRecord = {
  id: string;
  name: string;
  file_path: string;
  category: 'portfolio' | 'featured';
  description?: string;
  created_at: string;
  updated_at: string;
};

export type ContactInfoRecord = {
  id: string;
  email: string;
  phone: string;
  instagram_url: string;
  facebook_url: string;
  address: string;
  created_at: string;
  updated_at: string;
};

export type AnalyticsRecord = {
  id: string;
  event_type: 'page_view' | 'video_view' | 'photo_view' | 'contact_form_view' | 'booking_form_view';
  page_path: string;
  user_agent?: string;
  ip_address?: string;
  session_id?: string;
  metadata?: string; // JSON string for additional data
  created_at: string;
};