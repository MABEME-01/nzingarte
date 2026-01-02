-- Atribuir role admin ao dono Samuel Nzinga Júnior
-- Esta migração atribui o role admin ao utilizador com o email samuel587nzinga@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'samuel587nzinga@gmail.com'
ON CONFLICT DO NOTHING;