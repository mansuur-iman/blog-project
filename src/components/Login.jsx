import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "../context/useAuth";
import styles from "./Login.module.css";

const validate = (email, password) => {
  const errors = {};
  if (!email || !email.includes("@"))
    errors.email = "Enter a valid email address.";
  if (!password || password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  return errors;
};

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", apiError: "" }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validate(formData.email, formData.password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "https://blog-api-7iix.onrender.com/api/v1/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setErrors({ apiError: data.msg || "Login failed." });
        return;
      }

      // bug fix: was calling login(data.token) twice — once conditionally,
      // once unconditionally after the else block
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrors({ apiError: "Network error. Check your connection." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>Log in to access your account</p>
        </div>

        {errors.apiError && (
          <div className={styles.apiError} role="alert">
            {errors.apiError}
          </div>
        )}

        <form onSubmit={handleLogin} className={styles.form} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="you@example.com"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            />
            {errors.email && (
              <p className={styles.fieldError}>{errors.email}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <div className={styles.passwordWrap}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && (
              <p className={styles.fieldError}>{errors.password}</p>
            )}
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading && <span className={styles.spinner} aria-hidden />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className={styles.redirect}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.redirectLink}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
