-- Tabela para vídeos da galeria
CREATE TABLE public.gallery_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_videos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Vídeos visíveis por todos"
ON public.gallery_videos
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins podem ver todos os vídeos"
ON public.gallery_videos
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem inserir vídeos"
ON public.gallery_videos
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar vídeos"
ON public.gallery_videos
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem deletar vídeos"
ON public.gallery_videos
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_gallery_videos_updated_at
BEFORE UPDATE ON public.gallery_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela para configurações do site (incluindo código admin)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Inserir código admin inicial
INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES ('admin_code', 'saMueL-587');

-- Política: Apenas admins podem ler/atualizar configurações
CREATE POLICY "Admins podem ver configurações"
ON public.site_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar configurações"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar bucket para vídeos
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Políticas de storage para vídeos
CREATE POLICY "Vídeos são públicos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Admins podem fazer upload de vídeos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem deletar vídeos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'videos' AND public.has_role(auth.uid(), 'admin'));

-- Atualizar função handle_new_user para usar código dinâmico
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  admin_code TEXT;
  user_admin_code TEXT;
  user_role app_role := 'user';
BEGIN
  -- Buscar código admin atual da tabela site_settings
  SELECT setting_value INTO admin_code 
  FROM public.site_settings 
  WHERE setting_key = 'admin_code';
  
  -- Fallback para código padrão se não existir
  IF admin_code IS NULL THEN
    admin_code := 'saMueL-587';
  END IF;

  -- Verificar se o código de admin foi fornecido
  user_admin_code := NEW.raw_user_meta_data ->> 'admin_code';
  
  IF user_admin_code = admin_code THEN
    user_role := 'admin';
  END IF;

  -- Criar perfil
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Atribuir role (admin ou user)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$function$;