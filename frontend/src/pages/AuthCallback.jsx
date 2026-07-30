import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "@/api/authApi";

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

  return <p>Signing you in...</p>;
}
