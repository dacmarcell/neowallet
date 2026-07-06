import { useAuthSession } from "../hooks/useAuthSession";
import Dashboard from "./Dashboard";
import { Landing } from "./Landing";

export default function Home() {
  const { session, loading } = useAuthSession();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!session) return <Landing />;
  return <Dashboard />;
}
