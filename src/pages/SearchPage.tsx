import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">חיפוש קלפים</h2>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="חפש לפי שם, סט, או מספר קלף..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pr-10 pl-4 py-3 border rounded-lg bg-background"
        />
      </div>

      <div className="bg-card border rounded-xl p-8 text-center">
        <p className="text-muted-foreground">הקלד מונח חיפוש כדי למצוא קלפים</p>
      </div>
    </div>
  );
}
