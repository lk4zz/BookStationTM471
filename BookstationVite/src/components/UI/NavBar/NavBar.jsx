import Styles from "./NavBar.module.css";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookLogo, NotifButton } from "../Icons/IconLibrary";
import { useGetWallet } from "../../../hooks/useWallet";
import { checkIfGuest } from "../../../utils/checkIfGuest";
import Wallet from "../wallet/Wallet";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useCurrentUser } from "../../../hooks/useUser";
import { useUser } from "../../../hooks/useUser";
import { resolveImageUrl } from "../../../utils/ImageUrl";
import { linkStateFromHere } from "../../../utils/navigation";
import SearchBar from "./SearchBar";


function NavBar({ onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { balance, isWalletLoading, walletError } = useGetWallet();
  const { currentUser, isCurrentUserLoading, currentUserError} = useCurrentUser();
  


  if (isWalletLoading && !checkIfGuest) return <p className="loading"> wallet loading..</p>
  if (isCurrentUserLoading && !checkIfGuest) return <p className="loading"> loading..</p>

  const profileUrl = resolveImageUrl(currentUser?.profileImage);

  const isActive = (path) => location.pathname === path;
  return (
    <nav className={Styles.navBar}>
      {/* logo Section */}
      <div className={Styles.logoContainer}>
        <BookLogo className={Styles.logo} />
        <h1>Bookstation</h1>

      </div>

      {/* navigation Links this is the techinque use instead of link in bookcards */}
      <div className={Styles.navLinks}>
        <button
          onClick={() => {
            navigate("/explore");
          }}
          className={`${Styles.navItem} ${isActive("/explore") ? Styles.active : ""}`}
        >
          Explore
        </button>
        <button
          className={`${Styles.navItem} ${isActive("/library") ? Styles.active : ""}`}
          onClick={(e) => {
            navigate("/library");
          }}
        >
          Library
        </button>
        <button
          onClick={() => {
            navigate("/writing");
          }}
          className={`${Styles.navItem} ${isActive("/writing") ? Styles.active : ""}`}
        >
          Write
        </button>
      </div>

      {/* profile Section */}
      <div className={Styles.controls}>
        <SearchBar iconClassName={Styles.iconButton} onSearch={onSearch} />
        <Wallet balance={balance} />

        {/* profile Avatar  */}
        <UserAvatar
        profileUrl={profileUrl}
          onClick={() => {
            if (currentUser.id) {
              navigate(`/author/${currentUser.id}`, { state: linkStateFromHere(location) });
            } else {
              console.warn("No User ID found! Cannot navigate.");
            }
          }}
        />
      </div>
    </nav>
  );
}

export default NavBar;
