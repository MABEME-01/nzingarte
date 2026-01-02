import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image as ImageIcon, Upload, Pencil } from "lucide-react";
import { toast } from "sonner";

interface SiteImage {
  id: string;
  key: string;
  label: string;
  image_url: string;
  description: string | null;
  updated_at: string;
}

const AdminImages = () => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<SiteImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("site_images")
      .select("*")
      .order("label", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar imagens");
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const openEditDialog = (image: SiteImage) => {
    setEditingImage(image);
    setNewImageUrl(image.image_url);
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `site-images/${editingImage?.key}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(fileName, file);

    if (uploadError) {
      toast.error("Erro ao fazer upload da imagem");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("portfolio")
      .getPublicUrl(fileName);

    setNewImageUrl(urlData.publicUrl);
    setUploading(false);
    toast.success("Imagem carregada com sucesso");
  };

  const handleSave = async () => {
    if (!editingImage) return;

    const { error } = await supabase
      .from("site_images")
      .update({ image_url: newImageUrl })
      .eq("id", editingImage.id);

    if (error) {
      toast.error("Erro ao atualizar imagem");
    } else {
      toast.success("Imagem atualizada com sucesso");
      fetchImages();
      setDialogOpen(false);
      setEditingImage(null);
      setNewImageUrl("");
    }
  };

  const handleAddImage = async () => {
    const key = prompt("Insira a chave única para a nova imagem (ex: banner_home):");
    if (!key) return;

    const label = prompt("Insira o nome/label da imagem:");
    if (!label) return;

    const description = prompt("Insira uma descrição (opcional):");

    const { error } = await supabase
      .from("site_images")
      .insert([{
        key: key.toLowerCase().replace(/\s+/g, "_"),
        label,
        image_url: "",
        description: description || null
      }]);

    if (error) {
      if (error.code === "23505") {
        toast.error("Já existe uma imagem com esta chave");
      } else {
        toast.error("Erro ao adicionar imagem");
      }
    } else {
      toast.success("Imagem adicionada com sucesso");
      fetchImages();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">A carregar imagens...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Imagens do Site</CardTitle>
            <CardDescription>Substitua as imagens utilizadas no site</CardDescription>
          </div>
          <Button onClick={handleAddImage}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Nova Imagem
          </Button>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Nenhuma imagem configurada</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="aspect-video bg-muted relative">
                    {image.image_url ? (
                      <img
                        src={image.image_url}
                        alt={image.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground opacity-50" />
                      </div>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => openEditDialog(image)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium">{image.label}</h4>
                    <p className="text-xs text-muted-foreground">
                      Chave: {image.key}
                    </p>
                    {image.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Imagem: {editingImage?.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {newImageUrl ? (
                <img
                  src={newImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground opacity-50" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Carregar Nova Imagem</Label>
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
              <Label htmlFor="imageUrl">Ou insira URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex-1" disabled={uploading}>
                <Upload className="mr-2 h-4 w-4" />
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminImages;
