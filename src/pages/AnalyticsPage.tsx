export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">ניתוח אוסף</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-medium mb-4">התפלגות לפי משחק</h3>
          <p className="text-sm text-muted-foreground">הוסף קלפים כדי לראות סטטיסטיקות</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-medium mb-4">שווי לאורך זמן</h3>
          <p className="text-sm text-muted-foreground">הוסף קלפים כדי לראות סטטיסטיקות</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-medium mb-4">התפלגות לפי מצב</h3>
          <p className="text-sm text-muted-foreground">הוסף קלפים כדי לראות סטטיסטיקות</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-medium mb-4">התפלגות לפי נדירות</h3>
          <p className="text-sm text-muted-foreground">הוסף קלפים כדי לראות סטטיסטיקות</p>
        </div>
      </div>
    </div>
  );
}
