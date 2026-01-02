-- Tabela para anúncios/publicidade
CREATE TABLE public.advertisements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  position TEXT NOT NULL DEFAULT 'sidebar',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para imagens do site gerenciáveis
CREATE TABLE public.site_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for advertisements
CREATE POLICY "Anyone can view active advertisements"
ON public.advertisements FOR SELECT
USING (is_active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

CREATE POLICY "Admins can view all advertisements"
ON public.advertisements FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create advertisements"
ON public.advertisements FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update advertisements"
ON public.advertisements FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete advertisements"
ON public.advertisements FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for site_images
CREATE POLICY "Anyone can view site images"
ON public.site_images FOR SELECT
USING (true);

CREATE POLICY "Admins can create site images"
ON public.site_images FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site images"
ON public.site_images FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site images"
ON public.site_images FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_advertisements_updated_at
BEFORE UPDATE ON public.advertisements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_images_updated_at
BEFORE UPDATE ON public.site_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site images
INSERT INTO public.site_images (key, label, image_url, description) VALUES
('hero_background', 'Imagem de Fundo Hero', '', 'Imagem principal da página inicial'),
('about_image', 'Imagem Sobre Nós', '', 'Imagem da secção sobre nós'),
('logo_header', 'Logo Cabeçalho', '', 'Logo no cabeçalho do site'),
('logo_footer', 'Logo Rodapé', '', 'Logo no rodapé do site');

-- Create storage bucket for ads
INSERT INTO storage.buckets (id, name, public) VALUES ('advertisements', 'advertisements', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for advertisements bucket
CREATE POLICY "Anyone can view advertisement images"
ON storage.objects FOR SELECT
USING (bucket_id = 'advertisements');

CREATE POLICY "Admins can upload advertisement images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'advertisements' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update advertisement images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'advertisements' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete advertisement images"
ON storage.objects FOR DELETE
USING (bucket_id = 'advertisements' AND has_role(auth.uid(), 'admin'::app_role));