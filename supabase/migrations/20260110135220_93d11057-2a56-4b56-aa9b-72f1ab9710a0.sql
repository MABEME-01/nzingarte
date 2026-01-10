-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Todos podem ver testemunhos ativos"
ON public.testimonials
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins podem ver todos os testemunhos"
ON public.testimonials
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem inserir testemunhos"
ON public.testimonials
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar testemunhos"
ON public.testimonials
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar testemunhos"
ON public.testimonials
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for testimonials images
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for testimonials
CREATE POLICY "Testimonial images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonials');

CREATE POLICY "Admins can upload testimonial images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'testimonials' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update testimonial images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'testimonials' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete testimonial images"
ON storage.objects FOR DELETE
USING (bucket_id = 'testimonials' AND has_role(auth.uid(), 'admin'::app_role));

-- Insert default testimonials
INSERT INTO public.testimonials (name, role, image_url, text, rating, display_order) VALUES
('Esperança Luzolo', 'Empresária, Mbanza Kongo', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face', 'A NZINGA''RTE fez a renovação completa da minha loja. O trabalho de pladur e pintura ficou impecável. Profissionalismo do mais alto nível!', 5, 1),
('João Mavungo', 'Engenheiro Civil, Soyo', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Como profissional da construção, exijo qualidade. O Samuel e a sua equipa superaram as minhas expectativas no projecto do meu escritório.', 5, 2),
('Ana Kialungila', 'Médica, M''banza Kongo', 'https://images.unsplash.com/photo-1589156280159-27a852cc6e1d?w=150&h=150&fit=crop&crop=face', 'Transformaram a minha casa num espaço moderno e acolhedor. O tecto falso com iluminação LED ficou espetacular. Recomendo a todos!', 5, 3),
('Pedro Nkanga', 'Comerciante, Nzeto', 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face', 'Excelente trabalho na cozinha americana e nos guarda-roupas. Material de qualidade e equipa muito profissional. Preço justo!', 5, 4),
('Teresa Mbumba', 'Professora, Mbanza Kongo', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', 'O papel de parede e as placas 3D deram vida nova à minha sala. Trabalho limpo, rápido e com muito bom gosto. Obrigada NZINGA''RTE!', 5, 5);