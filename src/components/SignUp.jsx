import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./SignUp.module.css";

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "FirstName is required.";
    if (!formData.lastName) newErrors.lastName = "LastName is required.";
    if (!formData.username) newErrors.username = "username is required.";
    if (!formData.email || !formData.email.includes("@"))
      newErrors.email = "Email is required or invalid Email.";
    if (formData.password.length < 8)
      newErrors.password = "Password must be atleast 8 characters.";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Password do not match.";
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("Form submitted");

    const validationResult = validate();
    console.log("Validation result:", validationResult);

    if (Object.keys(validationResult).length > 0) {
      setErrors(validationResult);
      return;
    }

    console.log("Sending fetch request...");

    const res = await fetch(
      "https://blog-api-7iix.onrender.com/api/v1/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

    console.log("API response:", data);

    if (!res.ok) {
      setErrors({ apiError: data.msg || "registration failed." });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.wrapper}>
      {errors.apiError && <p className={styles.error}>{errors.apiError}</p>}
      <h2>Create an Account.</h2>
      <p className={styles.intro}>Join us and start your journey</p>
      <form onSubmit={handleRegister}>
        <div className={styles.div}>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            required
            autoComplete="firstName"
            onChange={handleChange}
          />
          {errors.firstName && (
            <p className={styles.error}>{errors.firstName}</p>
          )}
        </div>

        <div className={styles.div}>
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            required
            autoComplete="lastName"
            onChange={handleChange}
          />
          {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
        </div>
        <div className={styles.div}>
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Username"
            required
            autoComplete="username"
            onChange={handleChange}
          />
          {errors.username && <p className={styles.error}>{errors.username}</p>}
        </div>
        <div className={styles.div}>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            required
            autoComplete="email"
            onChange={handleChange}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div className={styles.div}>
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            required
            autoComplete="password"
            onChange={handleChange}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        <div className={styles.div}>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm Password"
            required
            autoComplete="confirmPassword"
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>
        <div className={styles.roleGroup}>
          <p>Account Type</p>

          <label>
            <input
              type="radio"
              name="role"
              value="READER"
              checked={formData.role === "READER"}
              onChange={handleChange}
            />
            Reader
          </label>

          <label>
            <input
              type="radio"
              name="role"
              value="AUTHOR"
              checked={formData.role === "AUTHOR"}
              onChange={handleChange}
            />
            Author
          </label>
        </div>

        <button type="submit">submit</button>
      </form>
      <p className={styles.redirect}>
        Already have an account <a href="/login">Log in</a>
      </p>
    </div>
  );
}
