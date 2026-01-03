import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Edit, Image, Upload, Star, Video, Play } from "lucide-react";
import { toast } from "sonner";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string;
  media_type: string;
  featured: boolean;
  display_order: number;
  created_at: string;
}

const categories = [
  { id: "pladur", name: "Pladur" },
  { id: "pintura", name: "Pintura" },
  { id: "tecto-falso", name: "Tecto Falso" },
  { id: "cozinha-americana", name: "Cozinha Americana" },
  { id: "guarda-roupa", name: "Guarda-roupa" },
  { id: "vasos", name: "Vasos Personalizados" },
  { id: "artesanato", name: "Artesanato" },
  { id: "outros", name: "Outros" },
];

const AdminPortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image_url: "",
    media_type: "image" as "image" | "video",
    featured: false,
  });

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching portfolio:", error);
      toast.error("Erro ao carregar portfólio");
      return;
    }

    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      toast.error("Por favor, selecione uma imagem ou vídeo");
      return;
    }

    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for video, 5MB for image
    if (file.size > maxSize) {
      toast.error(`O ficheiro deve ter menos de ${isVideo ? "50MB" : "5MB"}`);
      return;
    }

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Erro ao fazer upload");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("portfolio")
      .getPublicUrl(filePath);

    setFormData({ 
      ...formData, 
      image_url: publicUrl, 
      media_type: isVideo ? "video" : "image" 
    });
    setUploading(false);
    toast.success(isVideo ? "Vídeo carregado" : "Imagem carregada");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.image_url) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingItem) {
      const { error } = await supabase
        .from("portfolio_items")
        .update({
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          image_url: formData.image_url,
          media_type: formData.media_type,
          featured: formData.featured,
        })
        .eq("id", editingItem.id);

      if (error) {
        toast.error("Erro ao atualizar item");
        return;
      }

      toast.success("Item atualizado");
    } else {
      const { error } = await supabase.from("portfolio_items").insert({
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        image_url: formData.image_url,
        media_type: formData.media_type,
        featured: formData.featured,
        display_order: items.length,
      });

      if (error) {
        toast.error("Erro ao criar item");
        return;
      }

      toast.success("Item criado");
    }

    setDialogOpen(false);
    resetForm();
    fetchItems();
  };

  const deleteItem = async (item: PortfolioItem) => {
    if (!confirm("Tem a certeza que deseja eliminar este item?")) return;

    // Extract filename from URL and delete from storage
    const urlParts = item.image_url.split("/");
    const fileName = urlParts[urlParts.length - 1];

    await supabase.storage.from("portfolio").remove([fileName]);

    const { error } = await supabase
      .from("portfolio_items")
      .delete()
      .eq("id", item.id);

    if (error) {
      toast.error("Erro ao eliminar item");
      return;
    }

    toast.success("Item eliminado");
    fetchItems();
  };

  const toggleFeatured = async (item: PortfolioItem) => {
    const { error } = await supabase
      .from("portfolio_items")
      .update({ featured: !item.featured })
      .eq("id", item.id);

    if (error) {
      toast.error("Erro ao atualizar destaque");
      return;
    }

    fetchItems();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      image_url: "",
      media_type: "image",
      featured: false,
    });
    setEditingItem(null);
  };

  const openEditDialog = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      category: item.category,
      image_url: item.image_url,
      media_type: item.media_type as "image" | "video",
      featured: item.featured,
    });
    setDialogOpen(true);
  };

  const renderMediaPreview = (url: string, mediaType: string, isCard = false) => {
    if (mediaType === "video") {
      return (
        <video
          src={url}
          className="w-full h-full object-cover"
          autoPlay={isCard}
          loop={isCard}
          muted
          playsInline
        />
      );
    }
    return <img src={url} alt="Preview" className="w-full h-full object-cover" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Portfólio</h2>
          <p className="text-muted-foreground">Gerir imagens e vídeos do portfólio</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Editar Item" : "Novo Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Renovação de sala"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrição do trabalho"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Imagem ou Vídeo *</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaUpload}
                  accept="image/*,video/*"
                  className="hidden"
                />
                {formData.image_url ? (
                  <div className="relative rounded-lg overflow-hidden">
                    <div className="h-40">
                      {renderMediaPreview(formData.image_url, formData.media_type)}
                    </div>
                    <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      {formData.media_type === "video" ? (
                        <>
                          <Video className="h-3 w-3" />
                          Vídeo
                        </>
                      ) : (
                        <>
                          <Image className="h-3 w-3" />
                          Imagem
                        </>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      Alterar
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-40 border-dashed"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {uploading ? (
                        <span>A carregar...</span>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <Video className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <span className="text-muted-foreground">Clique para carregar imagem ou vídeo</span>
                          <span className="text-xs text-muted-foreground">(Imagem: máx 5MB | Vídeo: máx 50MB)</span>
                        </>
                      )}
                    </div>
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="cursor-pointer">Destaque na homepage</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={uploading}>
                {editingItem ? "Guardar Alterações" : "Criar Item"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">A carregar...</div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Image className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum item no portfólio</p>
            <p className="text-sm text-muted-foreground">Adicione o primeiro item clicando no botão acima.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-[4/3]">
                {renderMediaPreview(item.image_url, item.media_type, true)}
                {item.media_type === "video" && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full">
                    <Play className="h-4 w-4" />
                  </div>
                )}
                {item.featured && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Destaque
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openEditDialog(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => toggleFeatured(item)}>
                    <Star className={`h-4 w-4 ${item.featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteItem(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPortfolio;
