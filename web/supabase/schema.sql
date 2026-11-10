-- ========================================================
-- StepFlow - Supabase Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com
-- ========================================================

-- 1. Create Workflows Table
CREATE TABLE IF NOT EXISTS workflows (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  target_url TEXT,
  author TEXT DEFAULT 'Anonim',
  company_name TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Steps Table
CREATE TABLE IF NOT EXISTS steps (
  id TEXT PRIMARY KEY,
  workflow_id TEXT REFERENCES workflows(id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  action_type TEXT DEFAULT 'click',
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  page_title TEXT,
  screenshot_url TEXT,
  highlight JSONB,
  callout JSONB,
  blur_regions JSONB,
  target_element JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_steps_workflow_id ON steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflows_created_at ON workflows(created_at DESC);

-- 4. Supabase Storage Bucket for Screenshots
-- In Supabase Dashboard -> Storage -> Create new bucket 'screenshots' (Public)
-- Policy: Enable public read access
INSERT INTO storage.buckets (id, name, public) 
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access on Screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'screenshots');

CREATE POLICY "Anyone Can Upload Screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'screenshots');

