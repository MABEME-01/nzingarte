import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Wrench, Plus, Trash2, Edit2, Save, X, AlertTriangle, Upload, Image } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Emails dos donos autorizados
const AUTHORIZED_OWNERS = [
  "samuel587nzinga@gmail.com",
  "manuelbmendes01@gmail.com",
];

const ICONS = [
  "Wrench", "LayoutGrid", "Paintbrush", "Palette", "Grid3X3", "Square",
  "Wallpaper", "UtensilsCrossed", "Monitor", "DoorClosed", "Wine",
  "Layers", "Box", "SeparatorHorizontal", "BookOpen", "Footprints",
  "Mountain", "RectangleHorizontal", "Droplets", "Home", "Building",
  "Hammer", "Brush", "Lightbulb", "Sofa", "Bed"
];

interface CustomService {
  id: string;
  name: string;
  short_description: string;
  description: string;
  icon: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

const AdminServices = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<CustomService[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<CustomService | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    icon: "Wrench",
    image_url: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    checkAuthorization();
    fetchServices();
  }, []);

  const checkAuthorization = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email) {
      setCurrentUserEmail(session.user.email);
      setIsAuthorized(AUTHORIZED_OWNERS.includes(session.user.email.toLowerCase()));
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("custom_services")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("service-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("service-images")
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
      toast.success("Imagem carregada com sucesso!");
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      toast.error("Erro ao carregar imagem");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      short_description: "",
      description: "",
      icon: "Wrench",
      image_url: "",
      display_order: services.length,
      is_active: true,
    });
    setEditingService(null);
  };

  const openEditDialog = (service: CustomService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      short_description: service.short_description,
      description: service.description,
      icon: service.icon,
      image_url: service.image_url,
      display_order: service.display_order,
      is_active: service.is_active,
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!isAuthorized) {
      toast.error("Não está autorizado a realizar esta ação");
      return;
    }

    if (!formData.name || !formData.short_description || !formData.description || !formData.image_url) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSaving(true);

    try {
      if (editingService) {
        // Update
        const { error } = await supabase
          .from("custom_services")
          .update({
            name: formData.name,
            short_description: formData.short_description,
            description: formData.description,
            icon: formData.icon,
            image_url: formData.image_url,
            display_order: formData.display_order,
            is_active: formData.is_active,
          })
          .eq("id", editingService.id);

        if (error) throw error;
        toast.success("Serviço atualizado com sucesso!");
      } else {
        // Create
        const { error } = await supabase
          .from("custom_services")
          .insert({
            name: formData.name,
            short_description: formData.short_description,
            description: formData.description,
            icon: formData.icon,
            image_url: formData.image_url,
            display_order: formData.display_order,
            is_active: formData.is_active,
          });

        if (error) throw error;
        toast.success("Serviço criado com sucesso!");
      }

      setDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Erro ao guardar:", error);
      toast.error("Erro ao guardar serviço");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service: CustomService) => {
    if (!isAuthorized) {
      toast.error("Não está autorizado a realizar esta ação");
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o serviço "${service.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("custom_services")
        .delete()
        .eq("id", service.id);

      if (error) throw error;
      toast.success("Serviço excluído com sucesso!");
      fetchServices();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir serviço");
    }
  };

  const toggleActive = async (service: CustomService) => {
    if (!isAuthorized) {
      toast.error("Não está autorizado a realizar esta ação");
      return;
    }

    try {
      const { error } = await supabase
        .from("custom_services")
        .update({ is_active: !service.is_active })
        .eq("id", service.id);

      if (error) throw error;
      toast.success(service.is_active ? "Serviço desativado" : "Serviço ativado");
      fetchServices();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao atualizar serviço");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            Gestão de Serviços
          </h2>
          <p className="text-muted-foreground">
            Adicione ou edite serviços personalizados
          </p>
        </div>

        {isAuthorized && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Editar Serviço" : "Novo Serviço"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Serviço *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Pintura Decorativa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ícone</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICONS.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrição Curta *</Label>
                  <Input
                    value={formData.short_description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
                    placeholder="Breve descrição para cards"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descrição Completa *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição detalhada do serviço"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imagem *</Label>
                  <div className="flex items-center gap-4">
                    {formData.image_url ? (
                      <div className="relative w-24 h-24">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                        <Image className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="service-image-upload"
                        disabled={uploading}
                      />
                      <label htmlFor="service-image-upload">
                        <Button variant="outline" asChild disabled={uploading}>
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            {uploading ? "A carregar..." : "Carregar Imagem"}
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ordem de Exibição</Label>
                    <Input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ativo</Label>
                    <div className="flex items-center gap-2 pt-2">
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                      />
                      <span className="text-sm text-muted-foreground">
                        {formData.is_active ? "Visível" : "Oculto"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmit} disabled={saving}>
                    {saving ? (
                      "A guardar..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {editingService ? "Atualizar" : "Criar"} Serviço
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!isAuthorized && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Apenas o 1º e 2º dono (Samuel Nzinga Júnior e a conta secundária) podem adicionar ou excluir serviços.
            <br />
            <span className="text-sm opacity-75">Sessão atual: {currentUserEmail}</span>
          </AlertDescription>
        </Alert>
      )}

      {services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum serviço personalizado adicionado ainda.
              {isAuthorized && " Clique em 'Novo Serviço' para começar."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.id} className={!service.is_active ? "opacity-60" : ""}>
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                {!service.is_active && (
                  <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                    Inativo
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  {service.name}
                  <span className="text-xs text-muted-foreground">#{service.display_order}</span>
                </CardTitle>
                <CardDescription>{service.short_description}</CardDescription>
              </CardHeader>
              {isAuthorized && (
                <CardContent className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(service)}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(service)}
                  >
                    {service.is_active ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(service)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Serviços personalizados</strong> são exibidos na página de Serviços junto com os serviços padrão.
          </p>
          <p>
            <strong>Donos autorizados:</strong> Samuel Nzinga Júnior (1º dono) e conta admin secundária (2º).
          </p>
          <p>
            Os serviços padrão do sistema não podem ser removidos, mas você pode adicionar novos serviços personalizados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServices;
