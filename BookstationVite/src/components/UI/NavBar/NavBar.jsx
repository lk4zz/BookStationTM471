import Styles from "./NavBar.module.css";
import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // i am using react-router-dom (do research)
import { BookLogo, NotifButton, SearchButton } from "../Icons/IconLibrary";
import { useGetWallet } from "../../../hooks/useWallet";
import { checkIfGuest } from "../../../utils/checkIfGuest";
import Wallet from "../wallet/Wallet";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useCurrentUserId } from "../../../hooks/useUser";


function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { balance, isWalletLoading, walletError } = useGetWallet();
  const { currentUserId } = useCurrentUserId();

  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef(null);

  if (isWalletLoading && !checkIfGuest) return <p className="loading"> wallet loading..</p>

  const handleSearchClick = () => {
    setIsSearchActive(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 10);
  };
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
        <div
          className={`${Styles.searchContainer} ${isSearchActive ? Styles.searchActive : ""}`}
        >
          <SearchButton
            className={Styles.iconButton}
            aria-label="Search"
            onClick={handleSearchClick}
          />

          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            className={Styles.searchInput}
            onFocus={() => setIsSearchActive(true)}
            onBlur={(e) => {
              if (!e.target.value) setIsSearchActive(false);
            }}
          />
        </div>
        <Wallet balance={balance} />

        <button className={Styles.iconButton} aria-label="Notifications">
          <NotifButton />
        </button>

        {/* profile Avatar  */}
        <UserAvatar
          onClick={() => {
            if (currentUserId) {
              navigate(`/author/${currentUserId}`);
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
