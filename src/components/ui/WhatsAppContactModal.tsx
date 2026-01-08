import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Phone, User } from "lucide-react";

const owners = [
  { name: "Samuel Nzinga Júnior", phone: "+244 936 163 587", whatsapp: "244936163587" },
  { name: "Ndombe Makuta", phone: "+244 948 120 646", whatsapp: "244948120646" },
  { name: "Bikuki Daniel Júnior", phone: "+244 930 262 410", whatsapp: "244930262410" },
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
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
                <User className="h-6 w-6 text-[#25D366]" />
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
