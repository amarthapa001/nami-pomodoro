import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileBadge from "../components/ProfileBadge.jsx";

export function RequestsPage() {
  const { incomingRequests, respondToRequest, loading, error } = useAuth();

  return (
    <div className="main-content">
      <div style={{ marginBottom: 28 }}>
        <h1>Incoming Requests</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Review friend requests sent to you by other users.
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="panel">
        <div className="panel-header">
          <h2>📩 Pending & Past Requests ({incomingRequests.length})</h2>
        </div>
        <div className="list">
          {incomingRequests.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No incoming requests at this time.</p>
          ) : (
            incomingRequests.map((request) => (
              <div className="list-item" key={request.id}>
                <ProfileBadge profile={request.sender_profile} />
                <span className={`pill pill-${request.status}`}>
                  {request.status}
                </span>
                {request.status === "pending" && (
                  <div className="button-row">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => respondToRequest(request.id, "accepted")}
                      disabled={loading}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => respondToRequest(request.id, "rejected")}
                      disabled={loading}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestsPage;
