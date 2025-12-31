import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Trash2, Mail, Phone, Calendar, MessageSquare, Download } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_id: string | null;
  service_name: string | null;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  quoted: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  contacted: "Contactado",
  quoted: "Orçado",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
      toast.error("Erro ao carregar pedidos");
      return;
    }

    setQuotes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    const { error } = await supabase
      .from("quotes")
      .update({ status: newStatus })
      .eq("id", quoteId);

    if (error) {
      toast.error("Erro ao atualizar estado");
      return;
    }

    toast.success("Estado atualizado");
    fetchQuotes();
  };

  const updateAdminNotes = async (quoteId: string) => {
    const { error } = await supabase
      .from("quotes")
      .update({ admin_notes: adminNotes })
      .eq("id", quoteId);

    if (error) {
      toast.error("Erro ao guardar notas");
      return;
    }

    toast.success("Notas guardadas");
    fetchQuotes();
  };

  const deleteQuote = async (quoteId: string) => {
    if (!confirm("Tem a certeza que deseja eliminar este pedido?")) return;

    const { error } = await supabase.from("quotes").delete().eq("id", quoteId);

    if (error) {
      toast.error("Erro ao eliminar pedido");
      return;
    }

    toast.success("Pedido eliminado");
    fetchQuotes();
  };

  const filteredQuotes = quotes.filter((q) => 
    filterStatus === "all" ? true : q.status === filterStatus
  );

  const exportCSV = () => {
    const headers = ["Nome", "Email", "Telefone", "Serviço", "Mensagem", "Estado", "Data"];
    const rows = filteredQuotes.map(q => [
      q.name,
      q.email,
      q.phone || "",
      q.service_name || "",
      `"${q.message.replace(/"/g, '""')}"`,
      statusLabels[q.status],
      format(new Date(q.created_at), "dd/MM/yyyy HH:mm")
    ]);
    
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orcamentos-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado com sucesso");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Pedidos de Orçamento</h2>
          <p className="text-muted-foreground">Gerir todos os pedidos recebidos</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="contacted">Contactados</SelectItem>
              <SelectItem value="quoted">Orçados</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">A carregar...</div>
      ) : filteredQuotes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum pedido encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredQuotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{quote.name}</h3>
                      <Badge className={statusColors[quote.status]}>
                        {statusLabels[quote.status]}
                      </Badge>
                      {quote.service_name && (
                        <Badge variant="outline">{quote.service_name}</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <a href={`mailto:${quote.email}`} className="flex items-center gap-1 hover:text-primary">
                        <Mail className="h-3 w-3" />
                        {quote.email}
                      </a>
                      {quote.phone && (
                        <a href={`tel:${quote.phone}`} className="flex items-center gap-1 hover:text-primary">
                          <Phone className="h-3 w-3" />
                          {quote.phone}
                        </a>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(quote.created_at), "d MMM yyyy, HH:mm", { locale: pt })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{quote.message}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Select
                      value={quote.status}
                      onValueChange={(value) => updateQuoteStatus(quote.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="contacted">Contactado</SelectItem>
                        <SelectItem value="quoted">Orçado</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedQuote(quote);
                            setAdminNotes(quote.admin_notes || "");
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Pedido</DialogTitle>
                        </DialogHeader>
                        {selectedQuote && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Nome:</span>
                                <p className="text-muted-foreground">{selectedQuote.name}</p>
                              </div>
                              <div>
                                <span className="font-medium">Email:</span>
                                <p className="text-muted-foreground">{selectedQuote.email}</p>
                              </div>
                              <div>
                                <span className="font-medium">Telefone:</span>
                                <p className="text-muted-foreground">{selectedQuote.phone || "-"}</p>
                              </div>
                              <div>
                                <span className="font-medium">Serviço:</span>
                                <p className="text-muted-foreground">{selectedQuote.service_name || "-"}</p>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-sm">Mensagem:</span>
                              <p className="text-sm text-muted-foreground mt-1 bg-secondary/50 p-3 rounded-lg">
                                {selectedQuote.message}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-sm">Notas do Admin:</span>
                              <Textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Adicione notas sobre este pedido..."
                                className="mt-1"
                                rows={3}
                              />
                              <Button
                                size="sm"
                                className="mt-2"
                                onClick={() => updateAdminNotes(selectedQuote.id)}
                              >
                                Guardar Notas
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteQuote(quote.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;
