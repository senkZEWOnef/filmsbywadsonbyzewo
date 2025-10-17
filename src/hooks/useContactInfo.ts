"use client";

import { useState, useEffect } from 'react';
import { ContactInfoRecord } from '@/lib/database';

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfoRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/contact-info');
        
        if (!response.ok) {
          throw new Error('Failed to fetch contact info');
        }
        
        const data = await response.json();
        setContactInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contact info');
        console.error('Error fetching contact info:', err);
        
        // Set default values if fetch fails
        setContactInfo({
          id: '',
          email: 'hello@filmsbywadson.com',
          phone: '(555) 123-FILM',
          instagram_url: 'https://instagram.com/filmsbywadson',
          facebook_url: 'https://facebook.com/filmsbywadson',
          address: 'Serving weddings worldwide',
          created_at: '',
          updated_at: ''
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return { contactInfo, loading, error };
};