import { useState, useRef } from "react";
import Styles from "./SearchBar.module.css";
import { SearchButton } from "../UI/Icons/IconLibrary";

function SearchBar({ onSearch, iconClassName }) {
    const [isActive, setIsActive] = useState(false);
    const inputRef = useRef(null);

    const handleIconClick = () => {
        setIsActive(true);
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    const handleChange = (e) => {
        onSearch?.(e.target.value);
    };

    const handleBlur = (e) => {
        if (!e.target.value) setIsActive(false);
    };

    return (
        <div className={`${Styles.searchContainer} ${isActive ? Styles.searchActive : ""}`}>
            <SearchButton
                className={iconClassName}
                aria-label="Search"
                onClick={handleIconClick}
            />
            <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                className={Styles.searchInput}
                onChange={handleChange}
                onFocus={() => setIsActive(true)}
                onBlur={handleBlur}
            />
        </div>
    );
}

export default SearchBar;
