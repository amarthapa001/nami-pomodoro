import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileBadge from "../components/ProfileBadge.jsx";

export function SettingsPage() {
  const { profile, updateProfile, uploadAvatar, refreshAccessToken, loading, error } = useAuth();
  const [profileForm, setProfileForm] = useState({ display_name: "", bio: "" });
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (profile) {
      setProfileForm({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSuccessMsg("");
    const res = await updateProfile(profileForm);
    if (res) {
      setSuccessMsg("Profile saved successfully!");
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSuccessMsg("");
    await uploadAvatar(file);
    setSuccessMsg("Avatar uploaded successfully!");
    e.target.value = "";
  }

  function handleCopyUserId() {
    if (profile?.user_id || profile?.id) {
      navigator.clipboard.writeText(profile.user_id || profile.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: 28 }}>
        <h1>Account & Settings</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Customize your profile, manage account details, or refresh session tokens.
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {successMsg && (
        <div style={{ padding: "12px 16px", background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.4)", color: "#4ade80", borderRadius: "var(--radius-md)", marginBottom: 20 }}>
          {successMsg}
        </div>
      )}

      <div className="grid">
        {/* Profile Card Summary */}
        <section className="panel span-4">
          <div className="panel-header">
            <h2>👤 Current Profile</h2>
          </div>
          <ProfileBadge profile={profile} />

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border-color)" }}>
            <label style={{ marginBottom: 8 }}>Your User ID (for friends):</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                readOnly
                value={profile?.user_id || profile?.id || "N/A"}
                style={{ fontSize: "0.82rem", background: "var(--bg-dark)" }}
              />
              <button type="button" className="btn-outline-yellow" onClick={handleCopyUserId}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </section>

        {/* Profile Edit Form */}
        <section className="panel span-8">
          <div className="panel-header">
            <h2>✏️ Edit Details</h2>
          </div>
          <form onSubmit={handleSaveProfile} className="stack">
            <label>
              Display Name
              <input
                type="text"
                value={profileForm.display_name}
                onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                required
              />
            </label>

            <label>
              Bio / Status
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="What are you focusing on?"
              />
            </label>

            <div className="button-row" style={{ marginTop: 8 }}>
              <button type="submit" className="btn-primary" disabled={loading}>
                Save Changes
              </button>

              <label className="file-button-label">
                📷 Upload Avatar
                <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={loading} />
              </label>

              <button type="button" onClick={refreshAccessToken} disabled={loading} style={{ marginLeft: "auto" }}>
                🔑 Refresh Session Token
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
