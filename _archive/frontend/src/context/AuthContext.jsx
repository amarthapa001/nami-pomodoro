import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiRequest, storage } from "../api.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => storage.get());
  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [myRoom, setMyRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = auth?.access;

  const saveAuth = useCallback((nextAuth) => {
    setAuth(nextAuth);
    if (nextAuth) {
      storage.set(nextAuth);
    } else {
      storage.clear();
    }
  }, []);

  const runAsync = useCallback(async (action) => {
    setError("");
    setLoading(true);
    try {
      return await action();
    } catch (err) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!token) {
      return;
    }

    await runAsync(async () => {
      const [nextProfile, nextFriends, nextIncoming, nextRooms, nextMyRoom] = await Promise.all([
        apiRequest("/api/profile/me/", {}, token),
        apiRequest("/api/friends/", {}, token),
        apiRequest("/api/friends/requests/incoming/", {}, token),
        apiRequest("/api/rooms/", {}, token),
        apiRequest("/api/rooms/me/", {}, token),
      ]);

      setProfile(nextProfile);
      setFriends(nextFriends || []);
      setIncomingRequests(nextIncoming || []);
      setRooms(nextRooms || []);
      setMyRoom(nextMyRoom || null);
    });
  }, [token, runAsync]);

  useEffect(() => {
    if (token) {
      loadDashboard();
    }
  }, [token, loadDashboard]);

  const handleLogin = async (email, password) => {
    return await runAsync(async () => {
      const data = await apiRequest("/api/auth/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      saveAuth(data);
      navigate("/");
      return data;
    });
  };

  const handleRegister = async (email, password, display_name) => {
    return await runAsync(async () => {
      const data = await apiRequest("/api/auth/register/", {
        method: "POST",
        body: JSON.stringify({ email, password, display_name }),
      });
      saveAuth(data);
      navigate("/");
      return data;
    });
  };

  const refreshAccessToken = async () => {
    if (!auth?.refresh) return;
    await runAsync(async () => {
      const data = await apiRequest("/api/auth/refresh/", {
        method: "POST",
        body: JSON.stringify({ refresh: auth.refresh }),
      });
      saveAuth({ ...auth, ...data });
    });
  };

  const logout = async () => {
    await runAsync(async () => {
      if (auth?.refresh) {
        try {
          await apiRequest(
            "/api/auth/logout/",
            {
              method: "POST",
              body: JSON.stringify({ refresh: auth.refresh }),
            },
            token
          );
        } catch {
          // ignore logout token error
        }
      }
      saveAuth(null);
      setProfile(null);
      setFriends([]);
      setIncomingRequests([]);
      setRooms([]);
      setMyRoom(null);
      navigate("/auth");
    });
  };

  const updateProfile = async (profileData) => {
    return await runAsync(async () => {
      const data = await apiRequest(
        "/api/profile/me/",
        {
          method: "PATCH",
          body: JSON.stringify(profileData),
        },
        token
      );
      setProfile(data);
      return data;
    });
  };

  const uploadAvatar = async (file) => {
    if (!file) return;
    return await runAsync(async () => {
      const formData = new FormData();
      formData.append("avatar", file);
      await apiRequest(
        "/api/profile/me/avatar/",
        {
          method: "POST",
          body: formData,
        },
        token
      );
      await loadDashboard();
    });
  };

  const sendFriendRequest = async (receiverId) => {
    return await runAsync(async () => {
      await apiRequest(
        "/api/friends/requests/",
        {
          method: "POST",
          body: JSON.stringify({ receiver_id: receiverId }),
        },
        token
      );
      await loadDashboard();
    });
  };

  const respondToRequest = async (requestId, status) => {
    return await runAsync(async () => {
      await apiRequest(
        `/api/friends/requests/${requestId}/`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
        token
      );
      await loadDashboard();
    });
  };

  const removeFriend = async (friendshipId) => {
    return await runAsync(async () => {
      await apiRequest(
        `/api/friends/${friendshipId}/`,
        {
          method: "DELETE",
        },
        token
      );
      await loadDashboard();
    });
  };

  const value = {
    auth,
    token,
    profile,
    friends,
    incomingRequests,
    rooms,
    myRoom,
    loading,
    error,
    setError,
    loadDashboard,
    handleLogin,
    handleRegister,
    refreshAccessToken,
    logout,
    updateProfile,
    uploadAvatar,
    sendFriendRequest,
    respondToRequest,
    removeFriend,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
