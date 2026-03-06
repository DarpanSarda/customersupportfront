-- Create separate table for LLM credentials
CREATE TABLE IF NOT EXISTS llm_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,  -- 'openai', 'anthropic', 'google', 'cohere', 'openai-compatible', 'huggingface'
  api_key_encrypted TEXT NOT NULL,
  iv TEXT NOT NULL,  -- Initialization vector for AES-GCM
  tag TEXT NOT NULL,  -- Authentication tag for AES-GCM
  base_url TEXT,  -- Optional: for custom endpoints (OpenAI-compatible, etc.)
  model VARCHAR(100),  -- Optional: store the model name
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 4096,
  top_p DECIMAL(3,2) DEFAULT 1.0,
  top_k INTEGER DEFAULT 40,
  frequency_penalty DECIMAL(3,2) DEFAULT 0,
  presence_penalty DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(chatbot_id, provider)
);

-- Create indexes for performance
CREATE INDEX idx_llm_credentials_chatbot_id ON llm_credentials(chatbot_id);
CREATE INDEX idx_llm_credentials_provider ON llm_credentials(provider);

-- Enable Row Level Security
ALTER TABLE llm_credentials ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own chatbot credentials
CREATE POLICY "Users can view own LLM credentials"
  ON llm_credentials FOR SELECT
  USING (
    chatbot_id IN (
      SELECT id FROM chatbots WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert credentials for their own chatbots
CREATE POLICY "Users can insert own LLM credentials"
  ON llm_credentials FOR INSERT
  WITH CHECK (
    chatbot_id IN (
      SELECT id FROM chatbots WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can update their own credentials
CREATE POLICY "Users can update own LLM credentials"
  ON llm_credentials FOR UPDATE
  USING (
    chatbot_id IN (
      SELECT id FROM chatbots WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can delete their own credentials
CREATE POLICY "Users can delete own LLM credentials"
  ON llm_credentials FOR DELETE
  USING (
    chatbot_id IN (
      SELECT id FROM chatbots WHERE user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_llm_credentials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_llm_credentials_updated_at
  BEFORE UPDATE ON llm_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_llm_credentials_updated_at();
