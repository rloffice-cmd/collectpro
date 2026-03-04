import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  FolderOpen,
  BarChart3,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "דשבורד" },
  { to: "/cards", icon: CreditCard, label: "קלפים" },
  { to: "/collections", icon: FolderOpen, label: "אוספים" },
  { to: "/analytics", icon: BarChart3, label: "ניתוח" },
  { to: "/search", icon: Search, label: "חיפוש" },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
