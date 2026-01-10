import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, Facebook, Instagram, Music2, Save, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Fotos dos fundadores
import samuelPhoto from "@/assets/owners/samuel-nzinga.jpg";
import ndombePhoto from "@/assets/owners/ndombe-makuta.jpg";
import bikukiPhoto from "@/assets/owners/bikuki-daniel.jpg";
import pauloPhoto from "@/assets/owners/paulo-mvemba.jpg";

interface FounderSocial {
  id: string;
  founder_key: string;
  founder_name: string;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
}

const founderPhotos: Record<string, string> = {
  "samuel-nzinga": samuelPhoto,
  "ndombe-makuta": ndombePhoto,
  "bikuki-daniel": bikukiPhoto,
  "paulo-mvemba": pauloPhoto,
};

const AdminFounderSocials = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [founders, setFounders] = useState<FounderSocial[]>([]);
  const [formData, setFormData] = useState<Record<string, { facebook: string; instagram: string; tiktok: string }>>({});

  useEffect(() => {
    fetchFounders();
  }, []);

  const fetchFounders = async () => {
    try {
      const { data, error } = await supabase
        .from("founder_social_links")
        .select("*")
        .order("founder_name");

      if (error) throw error;

      setFounders(data || []);
      
      // Initialize form data
      const initialData: Record<string, { facebook: string; instagram: string; tiktok: string }> = {};
      data?.forEach((founder) => {
        initialData[founder.id] = {
          facebook: founder.facebook_url || "",
          instagram: founder.instagram_url || "",
          tiktok: founder.tiktok_url || "",
        };
      });
      setFormData(initialData);
    } catch (error) {
      console.error("Erro ao carregar fundadores:", error);
      toast.error("Erro ao carregar dados dos fundadores");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (founderId: string, field: "facebook" | "instagram" | "tiktok", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [founderId]: {
        ...prev[founderId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (founder: FounderSocial) => {
    setSaving(founder.id);
    
    try {
      const data = formData[founder.id];
      
      const { error } = await supabase
        .from("founder_social_links")
        .update({
          facebook_url: data.facebook || null,
          instagram_url: data.instagram || null,
          tiktok_url: data.tiktok || null,
        })
        .eq("id", founder.id);

      if (error) throw error;

      toast.success(`Redes sociais de ${founder.founder_name} atualizadas!`);
      fetchFounders();
    } catch (error) {
      console.error("Erro ao guardar:", error);
      toast.error("Erro ao guardar alterações");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6" />
          Redes Sociais dos Fundadores
        </h2>
        <p className="text-muted-foreground">
          Adicione ou atualize os links das redes sociais de cada fundador
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {founders.map((founder) => (
          <Card key={founder.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={founderPhotos[founder.founder_key]}
                  alt={founder.founder_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <CardTitle className="text-lg">{founder.founder_name}</CardTitle>
                  <CardDescription>Gerencie as redes sociais</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-[#1877F2]" />
                  Facebook
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://facebook.com/..."
                    value={formData[founder.id]?.facebook || ""}
                    onChange={(e) => handleInputChange(founder.id, "facebook", e.target.value)}
                  />
                  {formData[founder.id]?.facebook && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <a href={formData[founder.id].facebook} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-[#E4405F]" />
                  Instagram
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://instagram.com/..."
                    value={formData[founder.id]?.instagram || ""}
                    onChange={(e) => handleInputChange(founder.id, "instagram", e.target.value)}
                  />
                  {formData[founder.id]?.instagram && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <a href={formData[founder.id].instagram} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Music2 className="h-4 w-4" />
                  TikTok
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://tiktok.com/@..."
                    value={formData[founder.id]?.tiktok || ""}
                    onChange={(e) => handleInputChange(founder.id, "tiktok", e.target.value)}
                  />
                  {formData[founder.id]?.tiktok && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <a href={formData[founder.id].tiktok} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => handleSave(founder)}
                disabled={saving === founder.id}
              >
                {saving === founder.id ? (
                  "A guardar..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Alterações
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminFounderSocials;
