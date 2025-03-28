import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppRoutes from "./routes";
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicPaths = ["/register", "/login"];
    if (!token && !publicPaths.includes(location.pathname)) {
      navigate("/login", { state: { from: location.pathname } });
    } else if (token && publicPaths.includes(location.pathname)) {
      const redirectPath = location.state?.from || "/";
      if (redirectPath === "/login" || redirectPath === "/register") {
        navigate("/dashboard");
      } else {
        navigate(redirectPath);
      }
    }
  }, [navigate, location.pathname, location.state]);

  return <AppRoutes />;
}

export default App;