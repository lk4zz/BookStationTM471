import Styles from "./NavBar.module.css";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookLogo, NotifButton } from "../../Icons/IconLibrary";
import { useGetWallet } from "../../../hooks/useWallet";
import { checkIfGuest } from "../../../utils/checkIfGuest";
import Wallet from "../Wallet/Wallet";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useCurrentUser } from "../../../hooks/UserHooks/UseUser";
import { resolveDocumentUrl } from "../../../utils/ImageUrl";
import { linkStateFromHere } from "../../../utils/navigation";
import SearchBar from "./SearchBar";
import NotificationWindow from "../../Modals/NotificationWindow/NotificationWindow";
import { useNotifications } from "../../../hooks/UserHooks/useNotifications";
import toast from "react-hot-toast";


function NavBar({ onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { balance, isWalletLoading, walletError } = useGetWallet();
  const { currentUser, isCurrentUserLoading, currentUserError } = useCurrentUser();
  const { notifications, isNotificationsLoading, notificationsError } = useNotifications();

  // State and Ref for the Notification Modal
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Close modal when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isWalletLoading && !checkIfGuest) return <p className="loading"> wallet loading..</p>
  if (isCurrentUserLoading && !checkIfGuest) return <p className="loading"> loading..</p>
  if (isNotificationsLoading && !checkIfGuest) return <p className="loading"> notifications loading..</p>

  const profileUrl = resolveDocumentUrl(currentUser?.profileImage);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={Styles.navBar}>
      {/* logo Section */}
      <div className={Styles.logoContainer}>
        <BookLogo className={Styles.logo} />
        <h1>Bookstation</h1>
      </div>

      {/* navigation Links */}
      <div className={Styles.navLinks}>
        <button
          onClick={() => navigate("/explore")}
          className={`${Styles.navItem} ${isActive("/explore") ? Styles.active : ""}`}
        >
          Explore
        </button>
        <button
          className={`${Styles.navItem} ${isActive("/library") ? Styles.active : ""}`}
          onClick={() => navigate("/library")}
        >
          Library
        </button>
        <button
          onClick={() => navigate("/writing")}
          className={`${Styles.navItem} ${isActive("/writing") ? Styles.active : ""}`}
        >
          Write
        </button>
        {(currentUser?.roleId === 3 || currentUser?.roleId === 4) && (
          <button
            onClick={() => navigate("/admin")}
            className={`${Styles.navItem} ${isActive("/admin") ? Styles.active : ""}`}
          >
            admin
          </button>
        )}

      </div>

      {/* profile Section */}
      <div className={Styles.controls}>
        <SearchBar iconClassName={Styles.iconButton} onSearch={onSearch} />
        <Wallet balance={balance} />

        {/* Notification Wrapper */}
        <div className={Styles.notifWrapper} ref={notifRef}>
          {notifications?.length > 0 && (
            <div className={Styles.notifCount}>{notifications.length}</div>
          )}
          <NotifButton
            className={Styles.iconButton}
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          />
          {isNotifOpen && <NotificationWindow />}
        </div>

        {/* profile Avatar */}
        <UserAvatar
          profileUrl={profileUrl}
          onClick={() => {
            if (currentUser.id) {
              navigate(`/author/${currentUser.id}`, { state: linkStateFromHere(location) });
            } else {
              toast.error("No User ID found! Cannot navigate.");
            }
          }}
        />
      </div>
    </nav>
  );
}

export default NavBar;