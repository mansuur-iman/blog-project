import useAuth from "../context/useAuth";
import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router";

export default function Home() {
  const { token } = useAuth();
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://blog-api-7iix.onrender.com/api/v1/posts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.status === 401) {
          console.error("Invalid or expired token");
          return;
        }

        const data = await res.json();
        console.log("Posts:", data);

        const filteredPosts = data
          .filter((post) => post.published)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        console.log("filtered", filteredPosts);

        setLatestPosts(filteredPosts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  if (loading) return <p style={{ alignContent: "center" }}>loading....</p>;

  return (
    <div className={styles.wrapper}>
      {!loading && <h2 className={styles.latest}>Latest</h2>}

      <div className={styles.postGrid}>
        {latestPosts.map((post) => (
          <div key={post.id} className={styles.postCard}>
            <h4>{"@" + post.author.username}</h4>
            <h3>{post.title}</h3>
            <img
              src={post.imageUrl}
              alt={post.title}
              style={{ width: "300px" }}
            />
            <p className={styles.desc}>{post.description}</p>
            <button
              className={styles.readMore}
              type="button"
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              Read more
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
