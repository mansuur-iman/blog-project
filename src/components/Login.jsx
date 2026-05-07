import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Login.module.css";

import useAuth from "../context/useAuth";

export default function Login() {
  const [formData, setFormDta] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { login } = useAuth();

  const valiadte = () => {
    const newErrors = {};

    if (!formData.email || !formData.email.includes("@"))
      newErrors.email = "Email is required or invalid Email.";

    if (!formData.password || formData.password.length < 8)
      newErrors.password =
        "Password is required or Password must be atleast 8 characters.";

    return newErrors;
  };

  const handleChange = (e) => {
    setFormDta({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationResult = valiadte();
    if (Object.keys(validationResult).length > 0) {
      setErrors(validationResult);
      return;
    }

    const res = await fetch(
      "https://blog-api-7iix.onrender.com/api/v1/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      },
    );

    const data = await res.json();
    console.log("Api response", data);

    if (res.ok) {
      login(data.token);
    } else {
      setErrors({ apiError: data.msg || "Login failed." });
      return;
    }

    login(data.token);

    navigate("/");
  };

  return (
    <div className={styles.wrapper}>
      {errors.apiError && <p className={styles.error}>{errors.apiError}</p>}
      <h2>Welcome Back.</h2>
      <p className={styles.intro}>Login to access your Account</p>
      <form onSubmit={handleLogin}>
        <div className={styles.div}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div className={styles.div}>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="password"
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <button type="submit">submit</button>
      </form>
      <p className={styles.redirect}>
        don't have an account <a href="/register">Sign up</a>
      </p>
    </div>
  );
}
