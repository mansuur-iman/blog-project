import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import useAuth from "../context/useAuth";
import { ArrowRight } from "lucide-react";
import styles from "./Search.module.css";

export default function Search() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // bug fix: was never reading the URL — searchTerm was always ""
  const term = searchParams.get("term") || "";

  useEffect(() => {
    if (!term.trim()) return;

    const searchPost = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `https://blog-api-7iix.onrender.com/api/v1/posts/search?term=${encodeURIComponent(term)}&page=1&limit=10&sort=desc`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.status === 401) {
          setError("Session expired. Please log in again.");
          return;
        }

        if (!res.ok) throw new Error("Search failed.");

        const data = await res.json();
        // handle both {posts: [...]} and [...] response shapes
        setPosts(Array.isArray(data) ? data : data.posts || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) searchPost();
  }, [term, token]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <p className={styles.label}>Search results for</p>
        <h1 className={styles.term}>"{term}"</h1>
        {!loading && posts.length > 0 && (
          <span className={styles.count}>
            {posts.length} result{posts.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* States */}
      {loading && (
        <div className={styles.stateWrap}>
          <div className={styles.spinner} />
          <p className={styles.stateText}>Searching...</p>
        </div>
      )}

      {error && !loading && <p className={styles.errorText}>{error}</p>}

      {!loading && !error && !term.trim() && (
        <p className={styles.empty}>
          Enter a search term in the nav bar to find posts.
        </p>
      )}

      {!loading && !error && term && posts.length === 0 && (
        <div className={styles.stateWrap}>
          <p className={styles.empty}>No posts found for "{term}".</p>
        </div>
      )}

      {/* Results */}
      {!loading && posts.length > 0 && (
        <div className={styles.results}>
          {posts.map((post) => (
            <article
              key={post.id}
              className={styles.card}
              onClick={() => navigate(`/blog/${post.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/blog/${post.id}`)
              }
            >
              {post.imageUrl && (
                <div className={styles.imgWrap}>
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className={styles.img}
                  />
                </div>
              )}
              <div className={styles.cardBody}>
                <span className={styles.author}>@{post.author?.username}</span>
                <h3 className={styles.title}>{post.title}</h3>
                {post.description && (
                  <p className={styles.desc}>{post.description}</p>
                )}
                <div className={styles.footer}>
                  <span className={styles.date}>
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className={styles.readMore}>
                    Read <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
