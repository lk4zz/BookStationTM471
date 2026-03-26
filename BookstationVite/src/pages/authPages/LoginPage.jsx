import { Link } from "react-router-dom";
import styles from "./Auth.module.css";
import { SparklesIcon } from "../../components/UI/IconLibrary";
import { login } from "../../api/auth";
import { useAuthForm } from "../../hooks/useAuthForm";
import { InputField } from "../../components/UI/InputField";
//use navigate  here instead  oflink also
function LoginPage() {
  const { formData, error, isLoading, handleChange, handleSubmit } =
    useAuthForm(login, { email: "", password: "" }, "/explore");

  const isSubmitDisabled = isLoading || !formData.email || !formData.password;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            Bookstation <SparklesIcon className={styles.logoIcon} />
          </Link>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Log in to continue your journey.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField
            label="Email"
            id="email"
            type="email"
            required
            placeholder="reader@bookstation.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          <InputField
            label="Password"
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitDisabled}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
