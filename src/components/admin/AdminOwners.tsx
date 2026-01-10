import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Users, Trash2, AlertTriangle, Shield, ShieldCheck, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Emails dos dois primeiros donos (podem eliminar outros)
const FIRST_TWO_OWNERS = [
  "samuel587nzinga@gmail.com",
  "manuelbmendes01@gmail.com",
];

interface OwnerInfo {
  user_id: string;
  email: string;
  role: string;
  created_at: string;
  full_name: string | null;
}

const AdminOwners = () => {
  const [loading, setLoading] = useState(true);
  const [owners, setOwners] = useState<OwnerInfo[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [isFirstTwoOwner, setIsFirstTwoOwner] = useState(false);
  const [deleteOwner, setDeleteOwner] = useState<OwnerInfo | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    checkCurrentUser();
    fetchOwners();
  }, []);

  const checkCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email) {
      setCurrentUserEmail(session.user.email.toLowerCase());
      setIsFirstTwoOwner(FIRST_TWO_OWNERS.includes(session.user.email.toLowerCase()));
    }
  };

  const fetchOwners = async () => {
    try {
      // Usar a função RPC para buscar admins com emails
      const { data, error } = await supabase.rpc("get_admin_users");

      if (error) throw error;

      if (!data || data.length === 0) {
        setOwners([]);
        setLoading(false);
        return;
      }

      const ownersList: OwnerInfo[] = data.map((item: any) => ({
        user_id: item.user_id,
        email: item.email || "",
        role: item.role,
        created_at: item.created_at,
        full_name: item.full_name || null,
      }));

      setOwners(ownersList);
    } catch (error) {
      console.error("Erro ao carregar donos:", error);
      toast.error("Erro ao carregar lista de administradores");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOwner = async () => {
    if (!deleteOwner || !isFirstTwoOwner) {
      setDeleteOwner(null);
      return;
    }

    // Não permitir eliminar os dois primeiros donos
    const deleteEmail = deleteOwner.email.toLowerCase();
    if (FIRST_TWO_OWNERS.includes(deleteEmail)) {
      toast.error("Os dois primeiros donos não podem ser eliminados!");
      setDeleteOwner(null);
      return;
    }

    setDeleting(true);

    try {
      // Remover role de admin
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", deleteOwner.user_id)
        .eq("role", "admin");

      if (error) throw error;

      // Adicionar role de user normal
      await supabase
        .from("user_roles")
        .insert({
          user_id: deleteOwner.user_id,
          role: "user",
        });

      toast.success("Administrador removido com sucesso!");
      setDeleteOwner(null);
      fetchOwners();
    } catch (error) {
      console.error("Erro ao remover administrador:", error);
      toast.error("Erro ao remover administrador");
    } finally {
      setDeleting(false);
    }
  };

  const getOwnerRank = (email: string): number => {
    const lowerEmail = email.toLowerCase();
    const index = FIRST_TWO_OWNERS.indexOf(lowerEmail);
    return index >= 0 ? index + 1 : 0;
  };

  const isProtectedOwner = (email: string): boolean => {
    return FIRST_TWO_OWNERS.includes(email.toLowerCase());
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
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
            <Users className="h-6 w-6" />
            Gestão de Donos / Administradores
          </h2>
          <p className="text-muted-foreground">
            {owners.length} administrador{owners.length !== 1 ? "es" : ""} registado{owners.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {!isFirstTwoOwner && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Você pode visualizar a lista de administradores, mas apenas o 1º e 2º dono podem remover administradores.
          </AlertDescription>
        </Alert>
      )}

      {owners.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum administrador encontrado.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {owners.map((owner, index) => {
            const rank = getOwnerRank(owner.email);
            const isProtected = isProtectedOwner(owner.email);
            const isCurrentUser = owner.email.toLowerCase() === currentUserEmail;

            return (
              <Card key={owner.user_id} className={isCurrentUser ? "ring-2 ring-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        rank === 1 
                          ? "bg-amber-100 text-amber-700" 
                          : rank === 2 
                            ? "bg-slate-100 text-slate-700" 
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {rank > 0 ? (
                          <Crown className="h-6 w-6" />
                        ) : (
                          <ShieldCheck className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">
                            {owner.full_name || "Administrador"}
                          </h4>
                          {rank === 1 && (
                            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                              1º Dono
                            </Badge>
                          )}
                          {rank === 2 && (
                            <Badge variant="secondary">
                              2º Dono
                            </Badge>
                          )}
                          {isCurrentUser && (
                            <Badge variant="outline">
                              Você
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {owner.email || `ID: ${owner.user_id.substring(0, 8)}...`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Desde: {new Date(owner.created_at).toLocaleDateString("pt-PT")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isProtected ? (
                        <Badge variant="outline" className="text-muted-foreground">
                          <Shield className="h-3 w-3 mr-1" />
                          Protegido
                        </Badge>
                      ) : isFirstTwoOwner ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteOwner(owner)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Informações Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>1º Dono (Samuel Nzinga Júnior)</strong> e <strong>2º Dono</strong> são protegidos e não podem ser removidos.
          </p>
          <p>
            Apenas o 1º e 2º dono podem remover outros administradores.
          </p>
          <p>
            Quando um administrador é removido, ele é convertido para usuário normal e perde acesso ao painel administrativo.
          </p>
          <p>
            Novos administradores podem ser adicionados através do código de administrador na página de registro.
          </p>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteOwner} onOpenChange={(open) => !open && setDeleteOwner(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Administrador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{deleteOwner?.full_name || deleteOwner?.email}</strong> como administrador?
              <br /><br />
              Esta pessoa perderá acesso ao painel administrativo e será convertida para usuário normal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteOwner}
              disabled={deleting}
            >
              {deleting ? "A remover..." : "Remover Administrador"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOwners;
