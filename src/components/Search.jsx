import { useEffect, useState } from "react";
import useAuth from "../context/useAuth";

export default function Search() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (!searchTerm) return;

    const searchPost = async () => {
      try {
        const res = await fetch(
          `https://blog-api-7iix.onrender.com/api/v1/posts/search?term=${encodeURIComponent(
            searchTerm,
          )}&page=1&limit=10&sort=desc`,
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
        console.log("result", data);

        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) searchPost();
  }, [searchTerm, token]);

  return (
    <div>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="mb-4">
              <h3 className="font-bold">{post.title}</h3>
              <p>{post.text.slice(0, 100)}...</p>
              <small>By {post.author.username}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
