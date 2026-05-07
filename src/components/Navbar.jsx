import styles from "./Navbar.module.css";
import { Search, Menu, X, Sun, Moon, User } from "lucide-react";
import useTheme from "../context/useTheme";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router";
import { useState } from "react";
export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
  };
  return (
    <nav>
      <input type="checkbox" id="sidebar-active" className={styles.input} />
      <label htmlFor="sidebar-active" className={styles["open-sidebar-button"]}>
        <Menu size={32} />
      </label>

      <label
        htmlFor="sidebar-active"
        id="overlay"
        className={styles.overlay}
      ></label>

      <div className={styles.linksContainer}>
        <label
          htmlFor="sidebar-active"
          className={styles["close-sidebar-button"]}
        >
          <X size={32} />
        </label>

        <a className={styles.homeLink} href="/">
          myBlog
        </a>

        {token ? (
          <>
            <form
              className={styles.searchContainer}
              onSubmit={handleSearchSubmit}
            >
              <Search size={25} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search blogs..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <button>
              <User size={24} onClick={() => navigate("/profile")} />
            </button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register">Sign up</a>
          </>
        )}

        <button onClick={toggleTheme} className={styles.toggleIcon}>
          {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </div>
    </nav>
  );
}
