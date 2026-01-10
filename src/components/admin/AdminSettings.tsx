import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Settings, Shield, Eye, EyeOff, Save, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Emails dos donos autorizados a alterar o código admin
const AUTHORIZED_OWNERS = [
  "samuel587nzinga@gmail.com", // Samuel Nzinga Júnior (1º dono)
  "manuelbmendes01@gmail.com", // Conta admin secundária (2º)
];

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [newAdminCode, setNewAdminCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    checkAuthorization();
    fetchSettings();
  }, []);

  const checkAuthorization = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email) {
      setCurrentUserEmail(session.user.email);
      setIsAuthorized(AUTHORIZED_OWNERS.includes(session.user.email.toLowerCase()));
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "admin_code")
        .single();

      if (error) throw error;
      setAdminCode(data?.setting_value || "");
      setNewAdminCode(data?.setting_value || "");
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthorized) {
      toast.error("Não está autorizado a alterar esta configuração");
      return;
    }

    if (newAdminCode.trim().length < 6) {
      toast.error("O código deve ter pelo menos 6 caracteres");
      return;
    }

    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from("site_settings")
        .update({ 
          setting_value: newAdminCode.trim(),
          updated_by: session?.user?.id 
        })
        .eq("setting_key", "admin_code");

      if (error) throw error;

      setAdminCode(newAdminCode.trim());
      toast.success("Código de administrador atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao guardar:", error);
      toast.error("Erro ao guardar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      {/* Admin Code Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Código de Administrador
          </CardTitle>
          <CardDescription>
            Este código é usado para criar novas contas de administrador durante o registo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthorized ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Apenas o 1º e 2º dono (Samuel Nzinga Júnior e a conta secundária) podem alterar o código de administrador.
                <br />
                <span className="text-sm opacity-75">Sessão atual: {currentUserEmail}</span>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Está autorizado a alterar o código de administrador.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-code">Código Atual</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="current-code"
                      type={showCode ? "text" : "password"}
                      value={adminCode}
                      readOnly
                      className="font-mono bg-muted"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCode(!showCode)}
                    >
                      {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-code">Novo Código</Label>
                  <Input
                    id="new-code"
                    type="text"
                    value={newAdminCode}
                    onChange={(e) => setNewAdminCode(e.target.value)}
                    placeholder="Digite o novo código..."
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    Mínimo de 6 caracteres. Use letras, números e símbolos para maior segurança.
                  </p>
                </div>

                <Button 
                  onClick={handleSave} 
                  disabled={saving || newAdminCode === adminCode || newAdminCode.trim().length < 6}
                >
                  {saving ? (
                    <>Guardando...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Alterações
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Donos autorizados a alterar o código:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Samuel Nzinga Júnior (1º dono)</li>
              <li>Conta admin secundária (2º)</li>
            </ul>
            <p className="mt-4">
              Novos administradores podem ser criados quando um utilizador se regista 
              usando o código de administrador no campo apropriado.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
