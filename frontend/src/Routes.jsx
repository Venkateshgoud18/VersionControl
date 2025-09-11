// ProjectRoutes.jsx
import React, { useEffect } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import DashBoard from "./components/dashboard/Dashboard.jsx";
import Profile1 from "./components/user/Profile1.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import { useAuth } from "./authContext.jsx";

// Route guard for protected pages
const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return <Navigate to="/login" replace />;
  return children;
};

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();

  // Only restore user once; no navigation here
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && !currentUser) setCurrentUser(userId);
  }, [currentUser, setCurrentUser]);

  const element = useRoutes([
    // Public routes
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },

    // Protected routes
    { path: "/", element: <ProtectedRoute><DashBoard /></ProtectedRoute> },
    { path: "/profile", element: <ProtectedRoute><Profile1 /></ProtectedRoute> },

    // Catch-all → login (or 404 if you prefer)
    { path: "*", element: <Navigate to="/login" replace /> },
  ]);

  return element;
};

export default ProjectRoutes;
