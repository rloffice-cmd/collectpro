import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  FolderOpen,
  BarChart3,
  Search,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "דשבורד" },
  { to: "/cards", icon: CreditCard, label: "הקלפים שלי" },
  { to: "/collections", icon: FolderOpen, label: "אוספים" },
  { to: "/analytics", icon: BarChart3, label: "ניתוח" },
  { to: "/search", icon: Search, label: "חיפוש" },
  { to: "/settings", icon: Settings, label: "הגדרות" },
];

interface SidebarProps {
  onSignOut: () => void;
}

export function Sidebar({ onSignOut }: SidebarProps) {
  const { theme, toggle } = useTheme();
  return (
    <aside className="hidden md:flex md:w-64 flex-col border-l bg-card h-screen sticky top-0" role="navigation" aria-label="תפריט ראשי">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">CollectPro</h1>
        <p className="text-sm text-muted-foreground">ניהול אוסף קלפים</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t space-y-1">
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground w-full transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === 'dark' ? 'מצב בהיר' : 'מצב כהה'}
        </button>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          התנתקות
        </button>
      </div>
    </aside>
  );
}
