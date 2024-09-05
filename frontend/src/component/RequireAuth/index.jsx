import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export function RequireAuth() {
  const tokenId = useSelector((state) => state.userInfoReducer.tokenId);
  return tokenId ? <Outlet /> : <Navigate to="/login" replace />;
}
