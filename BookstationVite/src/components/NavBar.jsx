import Styles from './NavBar.module.css';
import React, { useState, useRef } from 'react';

function NavBar() {
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={Styles.logoIcon}>
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
                <h1>Bookstation</h1>
            </div>

            {/* navigation Links */}
            <div className={Styles.navLinks}>
                <button className={`${Styles.navItem} ${Styles.active}`}>Home</button>
                <button className={Styles.navItem}>Library</button>
                <button className={Styles.navItem}>Explore</button>
                <button className={Styles.navItem}>Write</button>
            </div>
            
            {/* profile Section */}
            <div className={Styles.controls}> 
                
                <div className={`${Styles.searchContainer} ${isSearchActive ? Styles.searchActive : ''}`}>
                    {/* Added onClick and style to make it act like a button */}
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" height="20" viewBox="0 0 24 24" 
                        fill="none" stroke="currentColor" strokeWidth="2" 
                        strokeLinecap="round" strokeLinejoin="round" 
                        className={Styles.searchIcon}
                        onClick={handleSearchClick}
                        style={{ cursor: 'pointer' }}
                    >
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                    </svg>
                    
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.268 21a2 2 0 0 0 3.464 0"/>
                        <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
                    </svg>
                </button>

                {/* profile Avatar  */}
                <div className={Styles.avatarContainer}>
                    <div className={Styles.avatarRing}>
                        <img src="/your-default-image.jpg" alt="User Profile" className={Styles.avatarImage} />
                    </div>
                    <span className={Styles.statusDot}></span>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;