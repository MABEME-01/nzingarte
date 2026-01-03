import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
  variant?: "default" | "compact";
  disableLink?: boolean;
}

const ServiceCard = ({ service, variant = "default", disableLink = false }: ServiceCardProps) => {
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Box;

  const cardContent = (
    <>
      {/* Service Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <IconComponent className="h-5 w-5" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {service.name}
          </h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {service.shortDescription}
        </p>
      </div>
    </>
  );

  if (variant === "compact") {
    const compactContent = (
      <>
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <IconComponent className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
            {service.name}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {service.shortDescription}
          </p>
        </div>
      </>
    );

    if (disableLink) {
      return (
        <div className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
          {compactContent}
        </div>
      );
    }

    return (
      <Link
        to={`/servicos/${service.id}`}
        className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300"
      >
        {compactContent}
        <LucideIcons.ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </Link>
    );
  }

  if (disableLink) {
    return (
      <div className="group block rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 ease-out cursor-default">
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      to={`/servicos/${service.id}`}
      className="group block rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {cardContent}
      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 text-primary font-medium text-sm">
          <span>Ver mais</span>
          <LucideIcons.ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
