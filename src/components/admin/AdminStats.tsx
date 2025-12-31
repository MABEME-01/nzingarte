import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";

interface Stats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: quotes, error } = await supabase.from("quotes").select("status");

      if (error) {
        console.error("Error fetching stats:", error);
        return;
      }

      const total = quotes?.length || 0;
      const pending = quotes?.filter((q) => q.status === "pending").length || 0;
      const completed = quotes?.filter((q) => q.status === "completed").length || 0;
      const cancelled = quotes?.filter((q) => q.status === "cancelled").length || 0;

      setStats({ total, pending, completed, cancelled });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total de Pedidos",
      value: stats.total,
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Pendentes",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Concluídos",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Cancelados",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral dos pedidos de orçamento</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loading ? "-" : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo, Samuel!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use o painel de navegação acima para gerir os pedidos de orçamento e o portfólio da NZINGA'RTE.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
