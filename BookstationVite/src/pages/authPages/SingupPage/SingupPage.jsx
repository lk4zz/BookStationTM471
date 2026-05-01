import { Link } from "react-router-dom";
import { SparklesIcon } from "../../../components/UI/Icons/IconLibrary";
import { signup } from "../../../api/auth";
import { useAuthForm } from "../../../hooks/useAuthForm";
import authStyles from "../Auth.module.css";
import SingupForm from "./SingupForm";

function SingupPage() {
  // Inline hook logic
  const { formData, error, isLoading, handleChange, handleSubmit } = useAuthForm(
    signup,
    { name: "", email: "", password: "" },
    "/explore"
  );

  const isSubmitDisabled =
    isLoading || !formData.name || !formData.email || !formData.password;

  return (
    <div className={authStyles.pageWrapper}>
      <div className={authStyles.authCard}>
        
        {/* Inline Header */}
        <div className={authStyles.header}>
          <Link to="/" className={authStyles.logo}>
            Bookstation <SparklesIcon className={authStyles.logoIcon} />
          </Link>
          <h1 className={authStyles.title}>Create an Account</h1>
          <p className={authStyles.subtitle}>
            Join the community of readers and writers.
          </p>
        </div>

        <SingupForm
          formData={formData}
          error={error}
          isLoading={isLoading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isSubmitDisabled={isSubmitDisabled}
        />

        {/* Inline Footer */}
        <p className={authStyles.footerText}>
          Already have an account?{" "}
          <Link to="/login" className={authStyles.link}>
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}

export default SingupPage;