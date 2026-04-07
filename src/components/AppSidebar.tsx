import { useAuth } from "@/lib/auth-context";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderOpen, LogOut, FileText, Headset, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Icon from '@/assets/img/NoBase-logo-white.svg';

const navItems = [
  { label: "Дашборд", icon: LayoutDashboard, path: "/" },
  { label: "Проекты", icon: FolderOpen, path: "/projects" },
  { label: "Поддержка", icon: Headset, path: "/support"},
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-80 h-screen flex flex-col bg-sidebar border-r border-sidebar-border shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            {/* <FileText className="w-5 h-5 text-sidebar-primary-foreground" /> */}
            <img src={Icon} alt="" />
          </div>
          <span className="font-display font-bold text-md text-sidebar-foreground tracking-tight">
            Fine<br />PAPERs
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <User className="w-4 h-4 text-sidebar-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.user_name}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => { logout(); navigate("/auth"); }}
            className="text-sidebar-foreground/50 hover:text-destructive transition-colors"
            title="Выйти"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
