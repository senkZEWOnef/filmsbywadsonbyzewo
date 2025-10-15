-- Create analytics table for tracking page views and user interactions
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('page_view', 'video_view', 'photo_view', 'contact_form_view', 'booking_form_view')),
    page_path VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_address INET,
    session_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);

-- Create a composite index for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_event_date ON analytics(event_type, created_at);