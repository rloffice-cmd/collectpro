import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";

// Lazy loading — כל עמוד נטען רק כשניגשים אליו
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const CardsPage = lazy(() => import("@/pages/CardsPage"));
const CollectionsPage = lazy(() => import("@/pages/CollectionsPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const AddCardPage = lazy(() => import("@/pages/AddCardPage"));
const EditCardPage = lazy(() => import("@/pages/EditCardPage"));

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function App() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {!user ? (
            <>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </>
          ) : (
            <Route element={<AppLayout onSignOut={signOut} />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/cards/new" element={<AddCardPage />} />
              <Route path="/cards/:id/edit" element={<EditCardPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
