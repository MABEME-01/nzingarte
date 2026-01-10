import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Upload, Video, Plus, Pencil, X, Check, GripVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  display_order: number;
  is_active: boolean;
}

const AdminVideos = () => {
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_videos")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      toast.error("Erro ao carregar vídeos");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Por favor, selecione um ficheiro de vídeo");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error("O vídeo deve ter menos de 100MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadVideo = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    const fileExt = selectedFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error } = await supabase.storage
      .from("videos")
      .upload(filePath, selectedFile);

    if (error) {
      console.error("Erro ao fazer upload:", error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("videos")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    if (!editingId && !selectedFile) {
      toast.error("Selecione um vídeo para fazer upload");
      return;
    }

    setUploading(true);

    try {
      let videoUrl = "";
      
      if (selectedFile) {
        const uploadedUrl = await uploadVideo();
        if (!uploadedUrl) throw new Error("Falha no upload");
        videoUrl = uploadedUrl;
      }

      if (editingId) {
        const updateData: Partial<GalleryVideo> = {
          title: formData.title.trim(),
          description: formData.description.trim() || null,
        };
        
        if (videoUrl) {
          updateData.video_url = videoUrl;
        }

        const { error } = await supabase
          .from("gallery_videos")
          .update(updateData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Vídeo atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("gallery_videos")
          .insert({
            title: formData.title.trim(),
            description: formData.description.trim() || null,
            video_url: videoUrl,
            display_order: videos.length,
          });

        if (error) throw error;
        toast.success("Vídeo adicionado com sucesso!");
      }

      resetForm();
      fetchVideos();
    } catch (error) {
      console.error("Erro ao salvar vídeo:", error);
      toast.error("Erro ao salvar vídeo");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "" });
    setSelectedFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (video: GalleryVideo) => {
    setFormData({
      title: video.title,
      description: video.description || "",
    });
    setEditingId(video.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este vídeo?")) return;

    try {
      const { error } = await supabase
        .from("gallery_videos")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Vídeo eliminado com sucesso!");
      fetchVideos();
    } catch (error) {
      console.error("Erro ao eliminar vídeo:", error);
      toast.error("Erro ao eliminar vídeo");
    }
  };

  const toggleActive = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from("gallery_videos")
        .update({ is_active: !currentValue })
        .eq("id", id);

      if (error) throw error;
      toast.success(currentValue ? "Vídeo desativado" : "Vídeo ativado");
      fetchVideos();
    } catch (error) {
      console.error("Erro ao atualizar estado:", error);
      toast.error("Erro ao atualizar estado");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Galeria de Vídeos</h2>
          <p className="text-muted-foreground">
            Gerencie os vídeos exibidos na galeria do site
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Vídeo
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              {editingId ? "Editar Vídeo" : "Novo Vídeo"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Instalação de Tecto Falso"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o conteúdo do vídeo..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video">
                  {editingId ? "Substituir Vídeo (opcional)" : "Ficheiro de Vídeo *"}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selecionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      A fazer upload...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {editingId ? "Guardar Alterações" : "Adicionar Vídeo"}
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Videos List */}
      <div className="grid gap-4">
        {videos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum vídeo adicionado ainda.
                <br />
                Clique em "Adicionar Vídeo" para começar.
              </p>
            </CardContent>
          </Card>
        ) : (
          videos.map((video) => (
            <Card key={video.id} className={!video.is_active ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <video
                      src={video.video_url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {video.description}
                      </p>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={video.is_active}
                        onCheckedChange={() => toggleActive(video.id, video.is_active)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {video.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(video)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(video.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminVideos;
