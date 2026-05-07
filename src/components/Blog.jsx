import { useParams } from "react-router";
import useAuth from "../context/useAuth";
import { useEffect, useState } from "react";
import styles from "./Blog.module.css";

export default function Blog() {
  const { token } = useAuth();
  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(
        `https://blog-api-7iix.onrender.com/api/v1/posts/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      console.log("POst", data);
      setPost(data);
      setComments(data.comments);
    };
    if (id) fetchPost();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || content.length === 0) {
      throw new Error("please provide a comment.");
    }
    try {
      const postId = post.id;
      const res = await fetch(
        `https://blog-api-7iix.onrender.com/api/v1/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: content }),
        },
      );

      const data = await res.json();
      setComments((prev) => [...prev, data || data.comments || []]);
      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    return;
  };

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <h1 className={styles.title}>{post?.title}</h1>

        <div className={styles.meta}>
          By {post?.author?.username} ·{" "}
          {new Date(post?.createdAt).toLocaleDateString()}
        </div>

        {post?.imageUrl && (
          <img src={post.imageUrl} alt="" className={styles.image} />
        )}

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post?.text }}
        />
      </article>

      <section className={styles.comments}>
        <h2 className={styles.commentsTitle}>Comments</h2>

        {comments?.length === 0 && (
          <p className={styles.noComments}>No comments yet.</p>
        )}

        <div className={styles.commentList}>
          {comments?.map((c) => (
            <div key={c.id} className={styles.comment}>
              <p className={styles.commentText}>{c.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={content}
            placeholder="Write a comment..."
            onChange={handleChange}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Post
          </button>
        </form>
      </section>
    </div>
  );
}
