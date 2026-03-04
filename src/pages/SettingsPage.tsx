import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">הגדרות</h2>

      <div className="bg-card border rounded-xl p-6 space-y-4">
        <h3 className="font-medium">פרטי חשבון</h3>
        <div>
          <label className="text-sm text-muted-foreground">אימייל</label>
          <p className="text-sm">{user?.email}</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6 space-y-4">
        <h3 className="font-medium">העדפות</h3>
        <p className="text-sm text-muted-foreground">בקרוב — מטבע, שפה, ערכת נושא</p>
      </div>
    </div>
  );
}
