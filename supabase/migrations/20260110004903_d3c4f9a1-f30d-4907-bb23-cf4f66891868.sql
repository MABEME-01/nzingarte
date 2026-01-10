-- Tabela para redes sociais dos fundadores
CREATE TABLE public.founder_social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  founder_key TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  facebook_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para serviços personalizados
CREATE TABLE public.custom_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Wrench',
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.founder_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_services ENABLE ROW LEVEL SECURITY;

-- Políticas para founder_social_links
CREATE POLICY "Todos podem ver redes sociais dos fundadores"
ON public.founder_social_links
FOR SELECT
USING (true);

CREATE POLICY "Admins podem inserir redes sociais"
ON public.founder_social_links
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar redes sociais"
ON public.founder_social_links
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar redes sociais"
ON public.founder_social_links
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para custom_services (somente donos autorizados)
CREATE POLICY "Todos podem ver serviços ativos"
ON public.custom_services
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins podem ver todos os serviços"
ON public.custom_services
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem inserir serviços"
ON public.custom_services
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar serviços"
ON public.custom_services
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar serviços"
ON public.custom_services
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Inserir dados iniciais para os 4 fundadores
INSERT INTO public.founder_social_links (founder_key, founder_name) VALUES
('samuel-nzinga', 'Samuel Nzinga Júnior'),
('ndombe-makuta', 'Ndombe Makuta'),
('bikuki-daniel', 'Bikuki Daniel Júnior'),
('paulo-mvemba', 'Paulo Mvemba Nzinga');

-- Trigger para updated_at
CREATE TRIGGER update_founder_social_links_updated_at
BEFORE UPDATE ON public.founder_social_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_services_updated_at
BEFORE UPDATE ON public.custom_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar bucket para imagens de serviços
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);

-- Políticas de storage para service-images
CREATE POLICY "Imagens de serviços são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images');

CREATE POLICY "Admins podem fazer upload de imagens de serviços"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar imagens de serviços"
ON storage.objects FOR UPDATE
USING (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar imagens de serviços"
ON storage.objects FOR DELETE
USING (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));