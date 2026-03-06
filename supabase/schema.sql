-- Users table only
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- RLS Policies for registration and login
-- Allow anyone to insert (register) - this is safe because we validate on server
CREATE POLICY IF NOT EXISTS "Allow public registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to read users by email (for login check)
CREATE POLICY IF NOT EXISTS "Allow public read by email"
  ON users
  FOR SELECT
  TO anon
  USING (true);

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Chatbots table
-- ========================================
CREATE TABLE IF NOT EXISTS chatbots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME Z  ONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Branding
  logo_url TEXT,
  title VARCHAR(255),
  subtitle TEXT,

  -- Layout
  bot_message_side VARCHAR(10) DEFAULT 'left' CHECK (bot_message_side IN ('left', 'right')),
  user_message_side VARCHAR(10) DEFAULT 'right' CHECK (user_message_side IN ('left', 'right')),
  bot_avatar_url TEXT,
  user_avatar_url TEXT,
  bot_message_color VARCHAR(7) DEFAULT '#66FCF1',
  user_message_color VARCHAR(7) DEFAULT '#45A29E',

  -- Widget
  widget_logo_url TEXT,
  widget_position VARCHAR(20) DEFAULT 'bottom-right' CHECK (widget_position IN ('bottom-right', 'bottom-left')),

  -- Content
  disclaimer_text TEXT,
  footer_text TEXT,
  header_text TEXT,

  -- Appearance
  chat_color VARCHAR(7) DEFAULT '#66FCF1',
  font_color VARCHAR(7) DEFAULT '#C5C6C7',
  font_family VARCHAR(100) DEFAULT 'Inter, sans-serif',
  bubble_style VARCHAR(20) DEFAULT 'rounded' CHECK (bubble_style IN ('rounded', 'square', 'pill')),
  chat_background_color VARCHAR(7) DEFAULT '#1F2937',
  chat_background_image TEXT,

  -- Size
  widget_size VARCHAR(20) DEFAULT 'medium' CHECK (widget_size IN ('small', 'medium', 'large')),
  widget_width INTEGER DEFAULT 400,
  widget_height INTEGER DEFAULT 600,

  -- Voice & Language
  enable_mic BOOLEAN DEFAULT false,
  supported_languages TEXT[] DEFAULT ARRAY['en'],
  default_language VARCHAR(10) DEFAULT 'en',

  -- Send Button
  send_button_color VARCHAR(7) DEFAULT '#66FCF1',
  send_button_icon VARCHAR(20) DEFAULT 'arrow' CHECK (send_button_icon IN ('arrow', 'paper-plane')),
  send_button_style VARCHAR(20) DEFAULT 'rounded' CHECK (send_button_style IN ('rounded', 'square', 'circle')),

  -- Loading Indicator
  loading_indicator_type VARCHAR(20) DEFAULT 'typing-dots' CHECK (loading_indicator_type IN ('typing-dots', 'pulsing-dot', 'spinning-dots', 'wave')),
  loading_indicator_color VARCHAR(7) DEFAULT '#66FCF1',
  loading_text VARCHAR(100) DEFAULT 'Typing...',

  -- Status & Behavior
  show_typing_indicator BOOLEAN DEFAULT true,
  typing_delay_ms INTEGER DEFAULT 800,
  persist_chat_history BOOLEAN DEFAULT true,

  -- Header Customization
  header_background_color VARCHAR(7),
  header_font_color VARCHAR(7),
  show_header BOOLEAN DEFAULT true,
  show_close_button BOOLEAN DEFAULT true,
  show_minimize_button BOOLEAN DEFAULT true,

  -- Message Text Colors
  bot_text_color VARCHAR(7),
  user_text_color VARCHAR(7),

  -- Bubble Customization
  bot_bubble_radius INTEGER DEFAULT 12,
  user_bubble_radius INTEGER DEFAULT 12,
  bot_bubble_shadow BOOLEAN DEFAULT false,
  user_bubble_shadow BOOLEAN DEFAULT false,

  -- Avatar Sizes
  bot_avatar_size INTEGER DEFAULT 32,
  user_avatar_size INTEGER DEFAULT 32,

  -- Input Box Customization
  input_placeholder TEXT DEFAULT 'Type your message...',
  input_background_color VARCHAR(7),
  input_text_color VARCHAR(7),
  input_border_color VARCHAR(7),
  input_border_radius INTEGER DEFAULT 8,

  -- Widget Button
  widget_button_color VARCHAR(7),
  widget_button_icon VARCHAR(50),
  widget_button_animation VARCHAR(20) CHECK (widget_button_animation IN ('pulse', 'bounce', 'none')),
  widget_button_text VARCHAR(50),
  show_widget_text BOOLEAN DEFAULT false,

  -- File Upload Settings
  enable_file_upload BOOLEAN DEFAULT false,
  allowed_file_types TEXT[],
  max_file_size_mb INTEGER DEFAULT 10,

  -- Notification Settings
  enable_notification_sound BOOLEAN DEFAULT false,
  notification_sound_url TEXT,

  -- Preview Messages
  preview_bot_message_1 TEXT DEFAULT '👋 Hello! How can I help you today?',
  preview_user_message TEXT DEFAULT 'I have a question about your services.',
  preview_bot_message_2 TEXT DEFAULT 'Sure! I''d be happy to help. What would you like to know?'
);

-- Indexes for chatbots
CREATE INDEX IF NOT EXISTS idx_chatbots_user_id ON chatbots(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbots_status ON chatbots(status);

-- Enable Row Level Security for chatbots
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chatbots
CREATE POLICY IF NOT EXISTS "Users can view their own chatbots"
  ON chatbots FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY IF NOT EXISTS "Users can insert their own chatbots"
  ON chatbots FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY IF NOT EXISTS "Users can update their own chatbots"
  ON chatbots FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY IF NOT EXISTS "Users can delete their own chatbots"
  ON chatbots FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Trigger to auto-update chatbots updated_at
CREATE TRIGGER update_chatbots_updated_at
  BEFORE UPDATE ON chatbots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
