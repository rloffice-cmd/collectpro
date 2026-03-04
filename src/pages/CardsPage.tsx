import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function CardsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">הקלפים שלי</h2>
        <Link
          to="/cards/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          הוסף קלף
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="חפש קלפים..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-10 pl-4 py-2 border rounded-lg bg-background text-sm"
        />
      </div>

      <div className="bg-card border rounded-xl p-8 text-center">
        <p className="text-muted-foreground">עדיין אין קלפים באוסף. הוסף את הקלף הראשון שלך!</p>
      </div>
    </div>
  );
}
