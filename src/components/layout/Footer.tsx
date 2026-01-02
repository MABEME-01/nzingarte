import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import logoNzingaFooter from "@/assets/logo-nzinga-footer.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoNzingaFooter}
                alt="NZINGA'RTE Logo"
                className="h-16 w-auto object-contain"
              />
              <div>
                <h3 className="font-display text-xl font-bold">NZINGA'RTE</h3>
                <p className="text-sm opacity-80">Fazer bem, faz bem</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Transformamos espaços simples em ambientes modernos, elegantes e
              funcionais. Especialistas em decoração interna em Mbanza Kongo.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/sobre"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  to="/servicos"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Serviços
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Portfólio
                </Link>
              </li>
              <li>
                <Link
                  to="/cursos"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  to="/contactos"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Contactos
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Serviços Populares
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/servicos/pladur"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Pladur
                </Link>
              </li>
              <li>
                <Link
                  to="/servicos/tecto-falso"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Tecto Falso
                </Link>
              </li>
              <li>
                <Link
                  to="/servicos/pintura"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Pintura
                </Link>
              </li>
              <li>
                <Link
                  to="/servicos/cozinha-americana"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Cozinha Americana
                </Link>
              </li>
              <li>
                <Link
                  to="/servicos/painel-tv"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  Painel de TV
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Contactos
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+244936163587"
                  className="flex items-center gap-3 text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  <Phone className="h-4 w-4" />
                  +244 936 163 587
                </a>
              </li>
              <li>
                <a
                  href="mailto:samuel587nzinga@gmail.com"
                  className="flex items-center gap-3 text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  <Mail className="h-4 w-4" />
                  samuel587nzinga@gmail.com
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm opacity-80">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>Mbanza Kongo, Zaire, Angola</span>
                </div>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/20 text-center">
          <p className="text-sm opacity-60">
            © {currentYear} NZINGA'RTE. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
