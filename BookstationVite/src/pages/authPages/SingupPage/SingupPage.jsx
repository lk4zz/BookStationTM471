import authStyles from "../Auth.module.css";
import SingupHeaderSection from "./sections/SingupHeaderSection/SingupHeaderSection";
import SingupFormSection from "./sections/SingupFormSection/SingupFormSection";
import SingupFooterSection from "./sections/SingupFooterSection/SingupFooterSection";
import { useSingupPage } from "./features/useSingupPage";

function SingupPage() {
  const { formData, error, isLoading, handleChange, handleSubmit } =
    useSingupPage();

  const isSubmitDisabled =
    isLoading || !formData.name || !formData.email || !formData.password;

  return (
    <div className={authStyles.pageWrapper}>
      <div className={authStyles.authCard}>
        <SingupHeaderSection />

        <SingupFormSection
          formData={formData}
          error={error}
          isLoading={isLoading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isSubmitDisabled={isSubmitDisabled}
        />

        <SingupFooterSection />
      </div>
    </div>
  );
}

export default SingupPage;
