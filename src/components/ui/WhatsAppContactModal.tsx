import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Phone } from "lucide-react";

import samuelPhoto from "@/assets/owners/samuel-nzinga.jpg";
import ndombePhoto from "@/assets/owners/ndombe-makuta.jpg";
import bikukiPhoto from "@/assets/owners/bikuki-daniel.jpg";
import pauloPhoto from "@/assets/owners/paulo-mvemba.jpg";

const owners = [
  { 
    name: "Samuel Nzinga Júnior", 
    phone: "+244 936 163 587", 
    whatsapp: "244936163587",
    photo: samuelPhoto
  },
  { 
    name: "Ndombe Makuta", 
    phone: "+244 948 120 646", 
    whatsapp: "244948120646",
    photo: ndombePhoto
  },
  { 
    name: "Bikuki Daniel Júnior", 
    phone: "+244 930 262 410", 
    whatsapp: "244930262410",
    photo: bikukiPhoto
  },
  { 
    name: "Paulo Mvemba Nzinga", 
    phone: "+244 927 120 941", 
    whatsapp: "244927120941",
    photo: pauloPhoto
  },
];

interface WhatsAppContactModalProps {
  children: React.ReactNode;
  message?: string;
}

const WhatsAppContactModal = ({ children, message = "Olá! Gostaria de pedir um orçamento." }: WhatsAppContactModalProps) => {
  const [open, setOpen] = useState(false);

  const handleContactClick = (whatsapp: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsapp}?text=${encodedMessage}`, "_blank");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            Escolha um contacto
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {owners.map((owner) => (
            <button
              key={owner.whatsapp}
              onClick={() => handleContactClick(owner.whatsapp)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-[#25D366]/20 group-hover:ring-[#25D366]/40 transition-all">
                <img 
                  src={owner.photo} 
                  alt={owner.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {owner.name}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {owner.phone}
                </p>
              </div>
              <MessageCircle className="h-5 w-5 text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Clique num contacto para abrir o WhatsApp
        </p>
      </DialogContent>
    </Dialog>
  );
};

export { owners };
export default WhatsAppContactModal;
