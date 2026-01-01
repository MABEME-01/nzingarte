import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import logoNzinga from "@/assets/logo-nzinga.png";

const navLinks = [
  { name: "Início", path: "/" },
  { name: "Sobre Nós", path: "/sobre" },
  { name: "Serviços", path: "/servicos" },
  { name: "Portfólio", path: "/portfolio" },
  { name: "Cursos", path: "/cursos" },
  { name: "Contactos", path: "/contactos" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        // Check admin role when user changes
        if (session?.user) {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data: hasRole } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    setIsAdmin(!!hasRole);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-[hsl(var(--header-bg))] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoNzinga}
              alt="NZINGA'RTE Logo"
              className="h-10 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="font-display text-lg font-bold text-[hsl(var(--header-foreground))]">
                NZINGA'RTE
              </h1>
              <p className="text-xs text-[hsl(var(--header-foreground))]/70">
                Fazer bem, faz bem
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-[hsl(var(--header-foreground))]/90 hover:bg-[hsl(var(--header-foreground))]/10 hover:text-[hsl(var(--header-foreground))]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="border-[hsl(var(--header-foreground))]/30 text-[hsl(var(--header-foreground))] hover:bg-[hsl(var(--header-foreground))]/10 hover:text-[hsl(var(--header-foreground))]">
              <a
                href="https://wa.me/244936163587"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
            <Button size="sm" asChild>
              <Link to="/contactos">Pedir Orçamento</Link>
            </Button>
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild className="text-[hsl(var(--header-foreground))]/90 hover:bg-[hsl(var(--header-foreground))]/10 hover:text-[hsl(var(--header-foreground))]">
                    <Link to="/admin" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2 text-[hsl(var(--header-foreground))]/90 hover:bg-[hsl(var(--header-foreground))]/10 hover:text-[hsl(var(--header-foreground))]">
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild className="text-[hsl(var(--header-foreground))]/90 hover:bg-[hsl(var(--header-foreground))]/10 hover:text-[hsl(var(--header-foreground))]">
                <Link to="/auth" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Entrar
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-[hsl(var(--header-foreground))]/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-[hsl(var(--header-foreground))]" />
            ) : (
              <Menu className="h-5 w-5 text-[hsl(var(--header-foreground))]" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[hsl(var(--header-foreground))]/20 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-[hsl(var(--header-foreground))]/90 hover:bg-[hsl(var(--header-foreground))]/10"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[hsl(var(--header-foreground))]/20">
                <Button variant="outline" asChild className="border-[hsl(var(--header-foreground))]/30 text-[hsl(var(--header-foreground))] hover:bg-[hsl(var(--header-foreground))]/10">
                  <a
                    href="https://wa.me/244936163587"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
                <Button asChild>
                  <Link to="/contactos" onClick={() => setIsMenuOpen(false)}>
                    Pedir Orçamento
                  </Link>
                </Button>
                {user ? (
                  <>
                    {isAdmin && (
                      <Button variant="ghost" asChild className="text-[hsl(var(--header-foreground))]/90 hover:bg-[hsl(var(--header-foreground))]/10">
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2">
                          <Settings className="h-4 w-4" />
                          Painel Admin
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" onClick={handleLogout} className="flex items-center justify-center gap-2 text-[hsl(var(--header-foreground))]/90 hover:bg-[hsl(var(--header-foreground))]/10">
                      <LogOut className="h-4 w-4" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" asChild className="text-[hsl(var(--header-foreground))]/90 hover:bg-[hsl(var(--header-foreground))]/10">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2">
                      <User className="h-4 w-4" />
                      Entrar
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
