import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "@/api/authApi";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        localStorage.setItem("token", token);
        const data = await getMe();
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
      }
    };

    authenticate();
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-sm font-medium text-foreground">Signing you in</p>
          <p className="text-xs text-muted-foreground">
            You'll be redirected shortly...
          </p>
        </div>
      </div>
    </div>
  );
}
