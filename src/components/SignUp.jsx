import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import styles from "./SignUp.module.css";

const validate = (formData) => {
  const errors = {};
  if (!formData.firstName.trim()) errors.firstName = "First name is required.";
  if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
  if (!formData.username.trim()) errors.username = "Username is required.";
  if (!formData.email || !formData.email.includes("@"))
    errors.email = "A valid email is required.";
  if (formData.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (formData.confirmPassword !== formData.password)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
};

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "READER",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", apiError: "" }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "https://blog-api-7iix.onrender.com/api/v1/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirmPassword,
            role: formData.role,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setErrors({ apiError: data.msg || "Registration failed." });
        return;
      }

      navigate("/login");
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
          <h2 className={styles.title}>Create an account</h2>
          <p className={styles.subtitle}>Join us and start your journey</p>
        </div>

        {errors.apiError && (
          <div className={styles.apiError} role="alert">
            {errors.apiError}
          </div>
        )}

        <form onSubmit={handleRegister} className={styles.form} noValidate>
          {/* Name row */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                placeholder="John"
                className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
              />
              {errors.firstName && (
                <p className={styles.fieldError}>{errors.firstName}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                placeholder="Doe"
                className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
              />
              {errors.lastName && (
                <p className={styles.fieldError}>{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Username */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="johndoe"
              className={`${styles.input} ${errors.username ? styles.inputError : ""}`}
            />
            {errors.username && (
              <p className={styles.fieldError}>{errors.username}</p>
            )}
          </div>

          {/* Email */}
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

          {/* Password */}
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
                autoComplete="new-password"
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

          {/* Confirm password */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className={styles.passwordWrap}>
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="••••••••"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={styles.fieldError}>{errors.confirmPassword}</p>
            )}
          </div>

          {/* Account type */}
          <div className={styles.roleGroup}>
            <p className={styles.label}>Account type</p>
            <div className={styles.roleOptions}>
              {["READER", "AUTHOR"].map((r) => (
                <label
                  key={r}
                  className={`${styles.roleOption} ${formData.role === r ? styles.roleActive : ""}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={formData.role === r}
                    onChange={handleChange}
                    className={styles.radioHidden}
                  />
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? <span className={styles.spinner} aria-hidden /> : null}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={styles.redirect}>
          Already have an account?{" "}
          <Link to="/login" className={styles.redirectLink}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
