import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Stats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
}

interface MonthlyData {
  month: string;
  count: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, completed: 0, cancelled: 0 });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: quotes, error } = await supabase.from("quotes").select("status, created_at");

      if (error) {
        console.error("Error fetching stats:", error);
        return;
      }

      const total = quotes?.length || 0;
      const pending = quotes?.filter((q) => q.status === "pending").length || 0;
      const completed = quotes?.filter((q) => q.status === "completed").length || 0;
      const cancelled = quotes?.filter((q) => q.status === "cancelled").length || 0;

      setStats({ total, pending, completed, cancelled });

      // Process monthly data
      const monthCounts: Record<string, number> = {};
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      
      // Initialize last 6 months
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
        monthCounts[key] = 0;
      }

      quotes?.forEach((q) => {
        const date = new Date(q.created_at);
        const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
        if (monthCounts.hasOwnProperty(key)) {
          monthCounts[key]++;
        }
      });

      setMonthlyData(Object.entries(monthCounts).map(([month, count]) => ({ month, count })));
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

  const COLORS = ["hsl(174, 62%, 35%)", "hsl(174, 55%, 45%)", "hsl(174, 48%, 55%)", "hsl(174, 40%, 65%)", "hsl(174, 35%, 75%)", "hsl(174, 30%, 85%)"];

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

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Pedidos por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              A carregar gráfico...
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(174, 20%, 88%)" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: "hsl(174, 15%, 45%)", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(174, 20%, 88%)" }}
                  />
                  <YAxis 
                    tick={{ fill: "hsl(174, 15%, 45%)", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(174, 20%, 88%)" }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(0, 0%, 100%)", 
                      border: "1px solid hsl(174, 20%, 88%)",
                      borderRadius: "8px"
                    }}
                    labelStyle={{ color: "hsl(174, 40%, 10%)", fontWeight: 600 }}
                  />
                  <Bar dataKey="count" name="Pedidos" radius={[4, 4, 0, 0]}>
                    {monthlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

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
