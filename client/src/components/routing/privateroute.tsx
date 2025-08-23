import type { ReactNode } from "react";
import { connect } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
  isResident: boolean;
  isModerator: boolean;
  is_admin: boolean;
};

type PrivateRouteProps = {
  auth: AuthState;
  children: ReactNode;
};

const roleWhitelists = {
  resident: ["/apr", "/profile"],
  admin: ["/dash", "/create_building"],
  moderator: [
    "/mod",
    "/apartments",
    "/create_apartment",
    "/qrcode",
    "/expenses",
    "/profile",
  ],
};

const PrivateRoute = ({ auth, children }: PrivateRouteProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  if (auth.loading) return null;
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Admin role validation
  if (auth.is_admin && !roleWhitelists.admin.includes(currentPath)) {
    return <Navigate to="/dash" replace />;
  }

  // Resident role validation
  if (
    auth.isResident &&
    !auth.isModerator &&
    !roleWhitelists.resident.includes(currentPath)
  ) {
    return <Navigate to="/apr" replace />;
  }

  // Moderator role validation
  if (auth.isModerator && !roleWhitelists.moderator.includes(currentPath)) {
    return <Navigate to="/mod" replace />;
  }

  return <>{children}</>;
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
