import { Navigate, useLocation, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useauth";


export function RequireAuth() {
  const { tokenId, loading } = useAuth();
  const location = useLocation();

  // Show loading screen while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no token, redirect to login page
  if (!tokenId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
