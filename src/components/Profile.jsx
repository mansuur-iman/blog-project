import { useNavigate } from "react-router";
import useAuth from "../context/useAuth";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import styles from "./Profile.module.css";

export default function Profile() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // bug fix: was useNavigate without ()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://blog-api-7iix.onrender.com/api/v1/users/me",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) throw new Error("Failed to load profile.");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user
    ? [user.first_name, user.last_name]
        .filter(Boolean)
        .map((n) => n.charAt(0).toUpperCase())
        .join("") || user.username?.charAt(0).toUpperCase()
    : "?";

  return (
    <div className={styles.page}>
      {loading && (
        <div className={styles.stateWrap}>
          <div className={styles.spinner} />
          <p className={styles.stateText}>Loading profile...</p>
        </div>
      )}

      {error && (
        <div className={styles.stateWrap}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {user && !loading && (
        <div className={styles.card}>
          {/* Avatar */}
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.avatarInfo}>
              <h2 className={styles.username}>{user.username}</h2>
              <span className={styles.role}>{user.role}</span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Fields */}
          <div className={styles.fields}>
            {[
              { label: "First Name", value: user.first_name },
              { label: "Last Name", value: user.last_name },
              { label: "Username", value: user.username },
              { label: "Email", value: user.email },
            ].map(({ label, value }) => (
              <div key={label} className={styles.field}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>
                  {value || <em className={styles.unset}>Not set</em>}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.divider} />

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
