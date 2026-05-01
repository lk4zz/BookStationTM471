import { Link } from "react-router-dom";
import { SparklesIcon } from "../../../components/UI/Icons/IconLibrary";
import { login } from "../../../api/auth";
import { useAuthForm } from "../../../hooks/useAuthForm";
import authStyles from "../Auth.module.css";
import LoginForm from "./LoginForm";

function LoginPage() {
  // Inline hook logic
  const { formData, error, isLoading, handleChange, handleSubmit } = useAuthForm(
    login, 
    { email: "", password: "" }, 
    "/explore"
  );

  const isSubmitDisabled = isLoading || !formData.email || !formData.password;

  return (
    <div className={authStyles.pageWrapper}>
      <div className={authStyles.authCard}>
        
        {/* Inline Header */}
        <div className={authStyles.header}>
          <Link to="/" className={authStyles.logo}>
            Bookstation <SparklesIcon className={authStyles.logoIcon} />
          </Link>
          <h1 className={authStyles.title}>Welcome Back</h1>
          <p className={authStyles.subtitle}>Log in to continue your journey.</p>
        </div>

        <LoginForm
          formData={formData}
          error={error}
          isLoading={isLoading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isSubmitDisabled={isSubmitDisabled}
        />

        {/* Inline Footer */}
        <p className={authStyles.footerText}>
          Don't have an account?{" "}
          <Link to="/signup" className={authStyles.link}>
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;