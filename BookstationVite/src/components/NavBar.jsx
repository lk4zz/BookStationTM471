import Styles from "./NavBar.module.css";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BookLogo, NotifButton, SearchButton } from "./UI/IconLibrary";

function NavBar() {
  const navigate = useNavigate();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef(null);
  const handleSearchClick = () => {
    setIsSearchActive(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 10);
  };
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
          onClick={() => {
            navigate("/explore");
          }}
          className={`${Styles.navItem} ${Styles.active}`}
        >
          Explore
        </button>
        <button
          className={Styles.navItem}
          onClick={() => {
            navigate("/library");
          }}
        >
          Library
        </button>
        <button
          onClick={() => {
            navigate("/write");
          }}
          className={Styles.navItem}
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

        <button className={Styles.iconButton} aria-label="Notifications">
            <NotifButton/>
        </button>

        {/* profile Avatar  */}
        <div className={Styles.avatarContainer}>
          <div className={Styles.avatarRing}>
            <img
              src="/your-default-image.jpg"
              alt="User Profile"
              className={Styles.avatarImage}
            />
          </div>
          <span className={Styles.statusDot}></span>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
