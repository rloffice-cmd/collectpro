import { CreditCard, FolderOpen, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "סה\"כ קלפים", value: "0", icon: CreditCard, color: "text-blue-500" },
  { label: "אוספים", value: "0", icon: FolderOpen, color: "text-green-500" },
  { label: "שווי כולל", value: "₪0", icon: TrendingUp, color: "text-purple-500" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">דשבורד</h2>
        <Link
          to="/cards/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          הוסף קלף
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-xl p-8 text-center">
        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">האוסף שלך ריק</h3>
        <p className="text-sm text-muted-foreground mb-4">
          התחל להוסיף קלפים לאוסף שלך
        </p>
        <Link
          to="/cards/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          הוסף את הקלף הראשון
        </Link>
      </div>
    </div>
  );
}
