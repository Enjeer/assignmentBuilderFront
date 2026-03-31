import { useAuth } from "@/lib/auth-context";
import { useProjects, getTypeLabel } from "@/lib/projects-context";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, AlertCircle, Plus, ArrowRight } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "Активный", variant: "outline" },
  inProgress: { label: "В работе", variant: "default" },
  done: { label: "Завершён", variant: "secondary" },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects } = useProjects();
  const navigate = useNavigate();

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "active").length,
    inProgress: projects.filter(p => p.status === "inProgress").length,
    done: projects.filter(p => p.status === "done").length,
  };

  const recentProjects = [...projects]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);

  const statCards = [
    { label: "Всего проектов", value: stats.total, icon: FileText, color: "text-primary" },
    { label: "Активных", value: stats.active, icon: AlertCircle, color: "text-warning" },
    { label: "В работе", value: stats.inProgress, icon: Clock, color: "text-accent" },
    { label: "Завершено", value: stats.done, icon: CheckCircle, color: "text-success" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Привет, {user?.name} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Вот обзор ваших проектов</p>
        </div>
        <Button onClick={() => navigate("/projects")} className="gap-2">
          <Plus className="w-4 h-4" /> Новый проект
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">Недавние проекты</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/projects")} className="gap-1 text-muted-foreground">
            Все проекты <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {recentProjects.map(p => {
            const sc = STATUS_CONFIG[p.status];
            return (
              <Card
                key={p.id}
                className="cursor-pointer border-border hover:border-primary/30 transition-all group"
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    <Badge variant={sc.variant} className="shrink-0 ml-2 text-xs">
                      {sc.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{getTypeLabel(p.type)}</span>
                    <span>Обновлён {p.updatedAt}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
