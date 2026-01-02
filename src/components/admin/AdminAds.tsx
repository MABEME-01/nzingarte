import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Advertisement {
  id: string;
  title: string;
  image_url: string | null;
  link_url: string | null;
  position: string;
  is_active: boolean;
  display_order: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

const positionLabels: Record<string, string> = {
  sidebar: "Barra Lateral",
  header: "Cabeçalho",
  footer: "Rodapé",
  popup: "Pop-up",
  inline: "Dentro do Conteúdo",
};

const AdminAds = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [position, setPosition] = useState("sidebar");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    const { data, error } = await supabase
      .from("advertisements")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar anúncios");
    } else {
      setAds(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setImageUrl("");
    setLinkUrl("");
    setPosition("sidebar");
    setIsActive(true);
    setDisplayOrder(0);
    setStartDate("");
    setEndDate("");
    setEditingAd(null);
  };

  const openEditDialog = (ad: Advertisement) => {
    setEditingAd(ad);
    setTitle(ad.title);
    setImageUrl(ad.image_url || "");
    setLinkUrl(ad.link_url || "");
    setPosition(ad.position);
    setIsActive(ad.is_active);
    setDisplayOrder(ad.display_order || 0);
    setStartDate(ad.start_date ? ad.start_date.split("T")[0] : "");
    setEndDate(ad.end_date ? ad.end_date.split("T")[0] : "");
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("advertisements")
      .upload(fileName, file);

    if (uploadError) {
      toast.error("Erro ao fazer upload da imagem");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("advertisements")
      .getPublicUrl(fileName);

    setImageUrl(urlData.publicUrl);
    setUploading(false);
    toast.success("Imagem carregada com sucesso");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    const adData = {
      title: title.trim(),
      image_url: imageUrl || null,
      link_url: linkUrl || null,
      position,
      is_active: isActive,
      display_order: displayOrder,
      start_date: startDate ? new Date(startDate).toISOString() : null,
      end_date: endDate ? new Date(endDate).toISOString() : null,
    };

    if (editingAd) {
      const { error } = await supabase
        .from("advertisements")
        .update(adData)
        .eq("id", editingAd.id);

      if (error) {
        toast.error("Erro ao atualizar anúncio");
      } else {
        toast.success("Anúncio atualizado com sucesso");
        fetchAds();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from("advertisements")
        .insert([adData]);

      if (error) {
        toast.error("Erro ao criar anúncio");
      } else {
        toast.success("Anúncio criado com sucesso");
        fetchAds();
        setDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este anúncio?")) return;

    const { error } = await supabase.from("advertisements").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao eliminar anúncio");
    } else {
      toast.success("Anúncio eliminado com sucesso");
      fetchAds();
    }
  };

  const toggleActive = async (ad: Advertisement) => {
    const { error } = await supabase
      .from("advertisements")
      .update({ is_active: !ad.is_active })
      .eq("id", ad.id);

    if (error) {
      toast.error("Erro ao atualizar estado");
    } else {
      fetchAds();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">A carregar anúncios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestão de Anúncios</CardTitle>
            <CardDescription>Gerencie os anúncios e publicidades do site</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Anúncio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAd ? "Editar Anúncio" : "Novo Anúncio"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nome do anúncio"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imagem</Label>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && (
                    <p className="text-sm text-muted-foreground">A carregar...</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkUrl">URL de Destino</Label>
                  <Input
                    id="linkUrl"
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://exemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Posição</Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(positionLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data Fim</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayOrder">Ordem</Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <Label htmlFor="isActive">Ativo</Label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingAd ? "Guardar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Nenhum anúncio criado ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  {ad.image_url ? (
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{ad.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {positionLabels[ad.position] || ad.position}
                    </p>
                    {ad.link_url && (
                      <a
                        href={ad.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Ver link
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={ad.is_active}
                      onCheckedChange={() => toggleActive(ad)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(ad)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(ad.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAds;
