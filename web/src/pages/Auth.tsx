import { useEffect } from "react";
import { useAuthSession } from "../hooks/useAuthSession";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/auth/AuthForm";

export default function Auth() {
  const { session, loading } = useAuthSession();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && session) navigate("/dashboard", { replace: true });
  }, [session, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <AuthForm />
    </div>
  );
}
