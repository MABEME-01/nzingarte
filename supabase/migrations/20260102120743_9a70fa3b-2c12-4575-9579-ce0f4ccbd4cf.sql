-- Actualizar Samuel Nzinga para admin
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = '16d3f2c7-b6b8-415f-8dcc-eb68b14d9403';

-- Actualizar Manuel Bemvindo Mendes para admin
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = '08746f22-b677-4a18-84a1-5ec5809913c4';

-- Actualizar trigger para verificar código de admin no registo
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_code TEXT := 'saMueL-587';
  user_admin_code TEXT;
  user_role app_role := 'user';
BEGIN
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
$$;