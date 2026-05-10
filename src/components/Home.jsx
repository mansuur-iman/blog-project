import useAuth from "../context/useAuth";
import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { useNavigate, Link } from "react-router";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { token } = useAuth();
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return; // don't fetch if not logged in

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          "https://blog-api-7iix.onrender.com/api/v1/posts",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.status === 401) {
          // token exists but is expired — clear and show guest screen
          setError("expired");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch posts.");

        const data = await res.json();
        const filtered = data
          .filter((post) => post.published)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setLatestPosts(filtered);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  // ── Not logged in ───────────────────────────────
  if (!token || error === "expired") {
    return (
      <div className={styles.guestWrap}>
        <div className={styles.guestCard}>
          <div className={styles.guestIcon}>✦</div>
          <h1 className={styles.guestTitle}>
            {error === "expired" ? "Session expired" : "Welcome to myBlog"}
          </h1>
          <p className={styles.guestSub}>
            {error === "expired"
              ? "Your session has expired. Please log in again to continue reading."
              : "Sign in to read the latest posts, comment, and explore stories from our authors."}
          </p>
          <div className={styles.guestActions}>
            <Link to="/login" className={styles.guestLoginBtn}>
              Log in
            </Link>
            <Link to="/register" className={styles.guestRegisterBtn}>
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.stateWrap}>
        <div className={styles.spinner} />
        <p className={styles.stateText}>Loading blogs...</p>
      </div>
    );
  }

  // ── Fetch error ─────────────────────────────────
  if (error) {
    return (
      <div className={styles.stateWrap}>
        <p className={styles.errorText}>{error}</p>
        <button
          type="button"
          className={styles.retryBtn}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const [featured, ...rest] = latestPosts;

  return (
    <div className={styles.wrapper}>
      <div className={styles.headingRow}>
        <h2 className={styles.latest}>Latest</h2>
        <span className={styles.count}>{latestPosts.length} posts</span>
      </div>

      {latestPosts.length === 0 ? (
        <p className={styles.empty}>No posts published yet.</p>
      ) : (
        <>
          {featured && (
            <div
              className={styles.featured}
              onClick={() => navigate(`/blog/${featured.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/blog/${featured.id}`)
              }
            >
              {featured.imageUrl && (
                <div className={styles.featuredImgWrap}>
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className={styles.featuredImg}
                  />
                </div>
              )}
              <div className={styles.featuredBody}>
                <span className={styles.featuredTag}>Featured</span>
                <h3 className={styles.featuredTitle}>{featured.title}</h3>
                {featured.description && (
                  <p className={styles.featuredDesc}>{featured.description}</p>
                )}
                <div className={styles.featuredMeta}>
                  <span className={styles.author}>
                    @{featured.author.username}
                  </span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.date}>
                    {new Date(featured.createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
                <div className={styles.readMoreLink}>
                  Read article <ArrowRight size={15} />
                </div>
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div className={styles.grid}>
              {rest.map((post) => (
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
                    <div className={styles.cardImgWrap}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className={styles.cardImg}
                      />
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    <span className={styles.author}>
                      @{post.author.username}
                    </span>
                    <h3 className={styles.cardTitle}>{post.title}</h3>
                    {post.description && (
                      <p className={styles.cardDesc}>{post.description}</p>
                    )}
                    <div className={styles.cardFooter}>
                      <span className={styles.date}>
                        {new Date(post.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <ArrowRight size={15} className={styles.arrow} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
