import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { get_user_role } from "../api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const response = await get_user_role();
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      }
    };
    checkRole();
  }, []);

  if (userRole === "vendor") {
    return <Navigate to="/vendorDashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
