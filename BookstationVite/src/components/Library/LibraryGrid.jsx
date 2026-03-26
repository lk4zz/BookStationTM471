import React from "react";
import BookCard from "../ExplorePageComp/BookCard";
import styles from "./LibraryGrid.module.css";

function LibraryGrid({ libraryItems }) {
  if (!libraryItems || libraryItems.length === 0) {
    return null;
  }

  return (
    <div className={styles.gridContainer}>
      {libraryItems.map((item) => (
        // item is the LibraryBook record, item.book is the actual Books record
        <BookCard key={item.id} book={item.book} />
      ))}
    </div>
  );
}

export default LibraryGrid;