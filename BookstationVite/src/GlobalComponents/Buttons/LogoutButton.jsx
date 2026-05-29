import { useNavigate } from "react-router-dom";
import styles from "./LogoutButton.module.css";
export default function LogoutButton() {
  const navigate = useNavigate();


  const handleLogout = () => {

    // Remove the JWT from localStorage
    localStorage.removeItem("token");

    // Redirect the user back to the login page (or homepage)
    navigate("/login");
  };

  //button UI
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