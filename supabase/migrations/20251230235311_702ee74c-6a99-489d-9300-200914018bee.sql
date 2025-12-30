-- Tabela de pedidos de orçamento
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_id TEXT,
  service_name TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de itens do portfólio
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Quotes policies: Apenas admins podem ver/editar, qualquer pessoa pode inserir
CREATE POLICY "Anyone can create quotes"
ON public.quotes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view all quotes"
ON public.quotes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update quotes"
ON public.quotes
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete quotes"
ON public.quotes
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Portfolio policies: Qualquer pessoa pode ver, apenas admins podem editar
CREATE POLICY "Anyone can view portfolio items"
ON public.portfolio_items
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can create portfolio items"
ON public.portfolio_items
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio items"
ON public.portfolio_items
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio items"
ON public.portfolio_items
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Triggers para updated_at
CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at
BEFORE UPDATE ON public.portfolio_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket para imagens do portfólio
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Storage policies
CREATE POLICY "Anyone can view portfolio images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio');

CREATE POLICY "Admins can upload portfolio images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

-- Dar role de admin ao Samuel Nzinga (quando ele se registar)
-- Isso será feito manualmente ou via trigger quando o email corresponder