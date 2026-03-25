import { Link } from "react-router-dom";
import styles from "./Auth.module.css";
import { SparklesIcon } from "../../components/UI/IconLibrary";
import { signup } from "../../api/auth";
import { useAuthForm } from "../../hooks/useAuthForm";
import { InputField } from "../../components/UI/InputField";

function SignupPage() {
  // from the custom hook (I pass signup(apifunction) and initialdata(input) and the route after signup)
  const { formData, error, isLoading, handleChange, handleSubmit } = useAuthForm(
    signup, 
    { name: "", email: "", password: "" }, 
    "/explore"
  );

  const isSubmitDisabled = isLoading || !formData.name || !formData.email || !formData.password;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            Bookstation <SparklesIcon className={styles.logoIcon} />
          </Link>
          <h1 className={styles.title}>Create an Account</h1>
          <p className={styles.subtitle}>Join the community of readers and writers.</p>
        </div>

        {/* 2. these are the input fields where data go (name or emailetcc) */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField 
            label="Full Name" 
            id="name" 
            type="text" 
            required 
            placeholder="John Doe" 
            value={formData.name} 
            onChange={handleChange} 
            disabled={isLoading} 
          />
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

          <button type="submit" className={styles.submitBtn} disabled={isSubmitDisabled}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link to="/login" className={styles.link}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;