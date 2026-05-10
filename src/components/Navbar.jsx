import styles from "./Navbar.module.css";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
import useTheme from "../context/useTheme";
import useAuth from "../context/useAuth";
import { useNavigate, Link } from "react-router";
import { useState } from "react";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const initial = user?.username?.charAt(0).toUpperCase() ?? "?";

  return (
    <>
      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <nav className={styles.nav}>
        {/* Brand */}
        <Link to="/" className={styles.brand} onClick={closeMenu}>
          myBlog
        </Link>

        {/* Desktop search — only when logged in */}
        {token && (
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search blogs..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        )}

        <div className={styles.actions}>
          {token ? (
            /* ── Logged in ── */
            <button
              type="button"
              className={styles.avatarBtn}
              onClick={() => navigate("/profile")}
              aria-label="Go to profile"
              title={user?.username ?? "Profile"}
            >
              {initial}
            </button>
          ) : (
            /* ── Logged out ── */
            <>
              <Link to="/login" className={styles.loginLink}>
                Log in
              </Link>
              <Link to="/register" className={styles.signupBtn}>
                Sign up
              </Link>
            </>
          )}

          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.hamburger}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}>
        {token ? (
          <>
            <form className={styles.drawerSearch} onSubmit={handleSearchSubmit}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search blogs..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            {/* User info row */}
            <div className={styles.drawerUser}>
              <div className={styles.drawerAvatar}>{initial}</div>
              <div className={styles.drawerUserInfo}>
                <span className={styles.drawerUsername}>{user?.username}</span>
                <span className={styles.drawerRole}>{user?.role}</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.drawerLink}
              onClick={() => {
                navigate("/profile");
                closeMenu();
              }}
            >
              Profile
            </button>
          </>
        ) : (
          <>
            {/* Prompt to log in */}
            <p className={styles.drawerPrompt}>
              Sign in to read and comment on posts.
            </p>
            <Link
              to="/login"
              className={styles.drawerLoginBtn}
              onClick={closeMenu}
            >
              Log in
            </Link>
            <Link
              to="/register"
              className={styles.drawerLink}
              onClick={closeMenu}
            >
              Create an account
            </Link>
          </>
        )}
      </div>
    </>
  );
}
