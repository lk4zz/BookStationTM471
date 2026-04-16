import { InputField } from "../../../../../components/UI/InputFields/InputField";
import styles from "../../../Auth.module.css";

function SingupFormSection({
  formData,
  error,
  isLoading,
  handleChange,
  handleSubmit,
  isSubmitDisabled,
}) {
  return (
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

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isSubmitDisabled}
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}

export default SingupFormSection;
