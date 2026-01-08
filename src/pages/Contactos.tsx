import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, MapPin, Send, HelpCircle, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/data/services";
import { z } from "zod";
import WhatsAppContactModal, { owners } from "@/components/ui/WhatsAppContactModal";

const faqItems = [
  {
    pergunta: "Quanto tempo demora a receber um orçamento?",
    resposta: "Normalmente respondemos em até 24 horas após receber o seu pedido. Para projectos mais complexos, pode demorar até 48 horas para garantir uma proposta detalhada."
  },
  {
    pergunta: "Vocês trabalham fora de Mbanza Kongo?",
    resposta: "Sim! Atendemos toda a província do Zaire e regiões vizinhas. Para locais mais distantes, incluímos os custos de deslocação no orçamento."
  },
  {
    pergunta: "Qual é o valor mínimo para um serviço?",
    resposta: "Cada projecto é único e não temos um valor mínimo fixo. Fazemos orçamentos gratuitos e sem compromisso para que possa avaliar a nossa proposta."
  },
  {
    pergunta: "Os materiais estão incluídos no preço?",
    resposta: "O orçamento pode incluir mão-de-obra e materiais ou apenas mão-de-obra, conforme a sua preferência. Indicamos claramente cada opção na proposta."
  },
  {
    pergunta: "Oferecem garantia nos trabalhos?",
    resposta: "Sim, todos os nossos trabalhos têm garantia de qualidade. O período de garantia varia conforme o tipo de serviço, sendo comunicado antes do início da obra."
  },
  {
    pergunta: "Como posso acompanhar o progresso do trabalho?",
    resposta: "Enviamos actualizações regulares por WhatsApp com fotos e vídeos do progresso. Também agendamos visitas presenciais sempre que necessário."
  }
];

const quoteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("Email inválido").max(255),
  telefone: z.string().max(20).optional(),
  servico: z.string().optional(),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(1000),
});

const Contactos = () => {
  const [formData, setFormData] = useState({ 
    nome: "", 
    email: "", 
    telefone: "", 
    servico: "",
    mensagem: "" 
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = quoteSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const selectedService = services.find(s => s.id === formData.servico);

      // Insert quote into database
      const { error: dbError } = await supabase.from("quotes").insert({
        name: formData.nome,
        email: formData.email,
        phone: formData.telefone || null,
        service_id: formData.servico || null,
        service_name: selectedService?.name || null,
        message: formData.mensagem,
      });

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Erro ao guardar pedido");
      }

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke("send-quote-notification", {
        body: {
          name: formData.nome,
          email: formData.email,
          phone: formData.telefone,
          serviceName: selectedService?.name,
          message: formData.mensagem,
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
        // Don't throw - quote is saved, just email failed
      }

      toast.success("Pedido de orçamento enviado! Entraremos em contacto em breve.");
      setFormData({ nome: "", email: "", telefone: "", servico: "", mensagem: "" });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Erro ao enviar pedido. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Contactos</span>
          <h1 className="font-display text-4xl font-bold text-foreground mt-2 mb-4">Pedir Orçamento</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preencha o formulário abaixo e receberá uma proposta personalizada.
          </p>
        </div>
      </section>
      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Informações de Contacto
                </h2>
                <p className="text-muted-foreground">
                  Estamos disponíveis para responder às suas questões e ajudar a transformar o seu espaço.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Telefone / WhatsApp</h3>
                    <div className="space-y-1">
                      {owners.map((owner) => (
                        <a 
                          key={owner.whatsapp}
                          href={`https://wa.me/${owner.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                        >
                          {owner.name}: {owner.phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <a href="mailto:samuel587nzinga@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                      samuel587nzinga@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Localização</h3>
                    <p className="text-muted-foreground">Mbanza Kongo, Zaire, Angola</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-2">Prefere contacto directo?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Fale connosco via WhatsApp para uma resposta imediata.
                </p>
                <WhatsAppContactModal message="Olá! Gostaria de pedir um orçamento.">
                  <Button className="w-full sm:w-auto">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Abrir WhatsApp
                  </Button>
                </WhatsAppContactModal>
              </div>
            </div>

            {/* Quote Form */}
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 space-y-6">
              <h2 className="font-display text-xl font-bold text-foreground">Formulário de Orçamento</h2>
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input 
                  id="nome"
                  placeholder="O seu nome" 
                  value={formData.nome} 
                  onChange={(e) => setFormData({...formData, nome: e.target.value})} 
                  required 
                />
                {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="seu@email.com" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  id="telefone"
                  placeholder="+244 XXX XXX XXX" 
                  value={formData.telefone} 
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servico">Serviço pretendido</Label>
                <Select value={formData.servico} onValueChange={(value) => setFormData({...formData, servico: value})}>
                  <SelectTrigger id="servico">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagem">Descreva o seu projeto *</Label>
                <Textarea 
                  id="mensagem"
                  placeholder="Conte-nos sobre o trabalho que precisa realizar, dimensões aproximadas, preferências de materiais, etc." 
                  value={formData.mensagem} 
                  onChange={(e) => setFormData({...formData, mensagem: e.target.value})} 
                  rows={5} 
                  required 
                />
                {errors.mensagem && <p className="text-sm text-destructive">{errors.mensagem}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  "A enviar..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Pedido de Orçamento
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Ao enviar, concorda em ser contactado pela NZINGA'RTE.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wider mb-2">
              <HelpCircle className="h-4 w-4" />
              <span>Dúvidas</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Perguntas Frequentes
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Encontre respostas às questões mais comuns dos nossos clientes.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                    {item.pergunta}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {item.resposta}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">
              Não encontrou a sua pergunta?
            </p>
            <WhatsAppContactModal message="Olá! Tenho uma dúvida sobre os vossos serviços.">
              <Button variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Fale Connosco
              </Button>
            </WhatsAppContactModal>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contactos;
