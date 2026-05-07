import { useNavigate } from "react-router";
import useAuth from "../context/useAuth";
import { useEffect, useState } from "react";

export default function Profile() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);

  const navigate = useNavigate;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://blog-api-7iix.onrender.com/api/v1/users/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        console.log("User:", data);

        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  return (
    <div>
      <h2>Profile</h2>

      {!user && <p>Loading...</p>}

      {user && (
        <div>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
