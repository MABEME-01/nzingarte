import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contactos = () => {
  const [formData, setFormData] = useState({ nome: "", email: "", telefone: "", mensagem: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada! Entraremos em contacto em breve.");
    setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
  };

  return (
    <Layout>
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Contactos</span>
          <h1 className="font-display text-4xl font-bold text-foreground mt-2 mb-4">Fale Connosco</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Estamos disponíveis para responder às suas questões.</p>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><Phone className="h-6 w-6 text-primary" /></div>
                <div><h3 className="font-semibold text-foreground mb-1">Telefone / WhatsApp</h3><a href="tel:+244936163587" className="text-muted-foreground hover:text-primary">+244 936 163 587</a></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><Mail className="h-6 w-6 text-primary" /></div>
                <div><h3 className="font-semibold text-foreground mb-1">Email</h3><a href="mailto:samuel587nzinga@gmail.com" className="text-muted-foreground hover:text-primary">samuel587nzinga@gmail.com</a></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><MapPin className="h-6 w-6 text-primary" /></div>
                <div><h3 className="font-semibold text-foreground mb-1">Localização</h3><p className="text-muted-foreground">Mbanza Kongo, Zaire, Angola</p></div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 space-y-6">
              <Input placeholder="Nome completo" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
              <Input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <Input placeholder="Telefone" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} />
              <Textarea placeholder="A sua mensagem..." value={formData.mensagem} onChange={(e) => setFormData({...formData, mensagem: e.target.value})} rows={4} required />
              <Button type="submit" className="w-full" size="lg">Enviar Mensagem</Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contactos;
