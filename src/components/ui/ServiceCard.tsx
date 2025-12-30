import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Service } from "@/data/services";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  variant?: "default" | "compact";
}

const ServiceCard = ({ service, variant = "default" }: ServiceCardProps) => {
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Box;

  if (variant === "compact") {
    return (
      <Link
        to={`/servicos/${service.id}`}
        className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300"
      >
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
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </Link>
    );
  }

  return (
    <Link
      to={`/servicos/${service.id}`}
      className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
        <IconComponent className="h-7 w-7" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {service.name}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {service.shortDescription}
      </p>
      <div className="flex items-center gap-2 text-primary font-medium text-sm">
        <span>Ver mais</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
      </div>
    </Link>
  );
};

export default ServiceCard;
