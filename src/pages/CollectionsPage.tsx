import { Plus } from "lucide-react";

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">אוספים</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
          <Plus className="h-4 w-4" />
          אוסף חדש
        </button>
      </div>

      <div className="bg-card border rounded-xl p-8 text-center">
        <p className="text-muted-foreground">עדיין אין אוספים. צור את האוסף הראשון שלך!</p>
      </div>
    </div>
  );
}
