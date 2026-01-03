-- Add media_type column to portfolio_items
ALTER TABLE public.portfolio_items 
ADD COLUMN media_type text NOT NULL DEFAULT 'image';

-- Add check constraint for valid media types
ALTER TABLE public.portfolio_items 
ADD CONSTRAINT valid_media_type CHECK (media_type IN ('image', 'video'));