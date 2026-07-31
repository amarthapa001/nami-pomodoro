import React from "react";

export function ProfileBadge({ profile }) {
  if (!profile) {
    return null;
  }

  const initial = profile.display_name?.[0]?.toUpperCase() || "P";

  return (
    <div className="profile-badge">
      <div className="avatar">
        {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.display_name || "Avatar"} /> : initial}
      </div>
      <div className="profile-info">
        <strong>{profile.display_name || "User"}</strong>
        <span>{profile.bio || "No bio yet"}</span>
      </div>
    </div>
  );
}

export default ProfileBadge;
