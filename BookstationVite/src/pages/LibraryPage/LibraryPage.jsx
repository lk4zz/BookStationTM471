import React from "react";
import NavBar from "../../components/NavBar";
import LibraryGrid from "../../components/Library/LibraryGrid";
import { useLibraryBooks } from "../../hooks/useLibrary";
import styles from "./LibraryPage.module.css";
import IsGuestLibrary from "../../components/Library/IsGuestLibrary";

function LibraryPage() {
  
  // quick guest check (el backend already prevent unauthorized entries)
  const isGuest = !localStorage.getItem("token");
  
  const { data: libraryItems, isLoading, isError, error } = useLibraryBooks(); //fetch books

  if (isGuest) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <IsGuestLibrary title={"Log in to view your Library"}
        body={"Log in to view your Library"}
        suggestion={"Login"}
        path={"/login"} />
      </div>
    );
  }

  // 2. Handle Loading State
  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <main className={styles.centeredContent}>
          {/* Using your provided loading class context */}
          <div className="loading">Loading library...</div> 
        </main>
      </div>
    );
  }

  // 3. Handle Empty State / Backend 404s
  // Your backend throws 404 with "YOUR LIBRARY IS EMPTY." or "YOU DONT HAVE A LIBRARY YET."
  if (isError && error.response?.status === 404) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <IsGuestLibrary title={"Your Library is Empty"}
        body={"You haven't added any books to your library yet."}
        suggestion={"Explore Books"}
        path={"/explore"} />
      </div>
    );
  }

  // 4. Handle generic errors
  if (isError) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <main className={styles.centeredContent}>
          <div className="error">Oops! Something went wrong loading your library.</div>
        </main>
      </div>
    );
  }

  // 5. Render Success State
  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Library</h1>
          <span className={styles.countBadge}>
            {libraryItems.length} {libraryItems.length === 1 ? "Book" : "Books"}
          </span>
        </div>
        
        <LibraryGrid libraryItems={libraryItems} />
      </main>
    </div>
  );
}

export default LibraryPage;