import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import RequestsPage from "./pages/RequestsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import RoomPage from "./pages/RoomPage.jsx";

function AppContent() {
  const { auth } = useAuth();

  if (!auth) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
