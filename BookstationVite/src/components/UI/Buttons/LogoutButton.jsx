import { useNavigate } from "react-router-dom";
import styles from "./LogoutButton.module.css";
export default function LogoutButton() {
  const navigate = useNavigate();


  const handleLogout = () => {

    // 1. Remove the JWT from localStorage
    localStorage.removeItem("token");

    // Note: If you store user data in localStorage too, clear it here!
    // localStorage.removeItem("user");

    // 2. Redirect the user back to the login page (or homepage)
    navigate("/login");
  };

  return (
    <button 
      onClick={handleLogout} 
      className={styles.logoutButton}
      type="button"
    >
      Log Out
    </button>
  );
}