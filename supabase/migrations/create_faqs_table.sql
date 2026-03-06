-- Create FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_faqs_chatbot_id ON faqs(chatbot_id);
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_order ON faqs(chatbot_id, order_index);

-- Enable Row Level Security
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view FAQs for their own chatbots
CREATE POLICY "Users can view own FAQs"
  ON faqs FOR SELECT
  USING (
    chatbot_id IN (
      SELECT id FROM chatbots WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert FAQs for their own chatbots
CREATE POLICY "Users can insert own FAQs"
  ON faqs FOR INSERT
  WITH CHECK (
    chatbot_id IN (
      SELECT id FROM chatbots WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can update their own FAQs
CREATE POLICY "Users can update own FAQs"
  ON faqs FOR UPDATE
  USING (
    chatbot_id IN (
      SELECT id FROM chatbots WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can delete their own FAQs
CREATE POLICY "Users can delete own FAQs"
  ON faqs FOR DELETE
  USING (
    chatbot_id IN (
      SELECT id FROM chatbots WHERE user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_faqs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_faqs_updated_at();
