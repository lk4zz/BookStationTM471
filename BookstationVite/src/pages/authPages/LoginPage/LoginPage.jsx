import authStyles from "../Auth.module.css";
import LoginHeaderSection from "./sections/LoginHeaderSection/LoginHeaderSection";
import LoginFormSection from "./sections/LoginFormSection/LoginFormSection";
import LoginFooterSection from "./sections/LoginFooterSection/LoginFooterSection";
import { useLoginPage } from "./features/useLoginPage";

function LoginPage() {
  const { formData, error, isLoading, handleChange, handleSubmit } =
    useLoginPage();

  const isSubmitDisabled = isLoading || !formData.email || !formData.password;

  return (
    <div className={authStyles.pageWrapper}>
      <div className={authStyles.authCard}>
        <LoginHeaderSection />

        <LoginFormSection
          formData={formData}
          error={error}
          isLoading={isLoading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isSubmitDisabled={isSubmitDisabled}
        />

        <LoginFooterSection />
      </div>
    </div>
  );
}

export default LoginPage;
