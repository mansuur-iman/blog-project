import { useParams } from "react-router";
import useAuth from "../context/useAuth";
import { useEffect, useState } from "react";
import styles from "./Blog.module.css";

export default function Blog() {
  const { token } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://blog-api-7iix.onrender.com/api/v1/posts/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) throw new Error("Failed to load post.");
        const data = await res.json();
        setPost(data);
        setComments(data.comments || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    try {
      setSubmitting(true);
      setCommentError("");
      const res = await fetch(
        `https://blog-api-7iix.onrender.com/api/v1/posts/${post.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: content }),
        },
      );
      if (!res.ok) throw new Error("Failed to post comment.");
      const data = await res.json();
      // bug fix: was spreading data || data.comments which always resolved to data
      setComments((prev) => [...prev, data.comment || data]);
      setContent("");
    } catch (err) {
      console.error(err);
      setCommentError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.stateWrap}>
        <div className={styles.spinner} />
        <p className={styles.stateText}>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateWrap}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (!post) return null;

  const authorInitial = post.author?.username?.charAt(0).toUpperCase() ?? "?";
  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          {post.description && (
            <p className={styles.description}>{post.description}</p>
          )}
          <div className={styles.meta}>
            <div className={styles.authorChip}>
              <span className={styles.authorAvatar}>{authorInitial}</span>
              <span className={styles.authorName}>{post.author?.username}</span>
            </div>
            <span className={styles.dot}>·</span>
            <time className={styles.date} dateTime={post.createdAt}>
              {formattedDate}
            </time>
          </div>
        </header>

        {/* Cover image */}
        {post.imageUrl && (
          <div className={styles.imageWrapper}>
            <img
              src={post.imageUrl}
              alt={post.title}
              className={styles.image}
            />
          </div>
        )}

        {/* Body */}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.text }}
        />
      </article>

      {/* Comments */}
      <section className={styles.comments}>
        <h2 className={styles.commentsTitle}>
          {comments.length > 0 ? `${comments.length} Comments` : "Comments"}
        </h2>

        {comments.length === 0 ? (
          <p className={styles.noComments}>Be the first to leave a comment.</p>
        ) : (
          <div className={styles.commentList}>
            {comments.map((c) => (
              <div key={c.id} className={styles.comment}>
                <div className={styles.commentAvatar}>
                  {c.author?.username?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <div className={styles.commentBody}>
                  <span className={styles.commentAuthor}>
                    {c.author?.username ?? "Anonymous"}
                  </span>
                  <p className={styles.commentText}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {commentError && (
            <p className={styles.commentError}>{commentError}</p>
          )}
          <div className={styles.inputRow}>
            <input
              type="text"
              value={content}
              placeholder="Write a comment..."
              onChange={(e) => {
                setContent(e.target.value);
                setCommentError("");
              }}
              className={styles.input}
              disabled={submitting}
            />
            <button
              type="submit"
              className={styles.button}
              disabled={submitting || !content.trim()}
            >
              {submitting ? "..." : "Post"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
