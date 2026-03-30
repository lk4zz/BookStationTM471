import React from "react";
import NavBar from "../../components/UI/NavBar/NavBar";
import LibraryGrid from "../../components/LibraryComp/LibraryGrid/LibraryGrid";
import { useLibraryBooks } from "../../hooks/useLibrary";
import styles from "./LibraryPage.module.css";
import EmptyLibrary from "../../components/LibraryComp/EmptyLibrary/EmptyLibrary";

function LibraryPage() {

  // quick guest check (el backend already prevent unauthorized entries)
  const isGuest = !localStorage.getItem("token");
  const { data: libraryItems, isLoading, isError, error } = useLibraryBooks(); //fetch books

  if (isGuest) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <EmptyLibrary title={"Log in to view your Library"}
          body={"Log in to view your Library"}
          suggestion={"Login"}
          path={"/login"} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <main className={styles.centeredContent}>

          <div className="loading">Loading library...</div>
        </main>
      </div>
    );
  }

  if (isError && error?.status === 404) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <EmptyLibrary title={"Your Library is Empty"}
          body={"You haven't added any books to your library yet."}
          suggestion={"Explore Books"}
          path={"/explore"} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.pageWrapper}>
        <NavBar />
        <main className={styles.centeredContent}>
          <div className="error">{error?.message || "Oops! Something went wrong loading your library."}</div>
        </main>
      </div>
    );
  }

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