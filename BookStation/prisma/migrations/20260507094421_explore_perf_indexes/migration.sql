-- AddIndex: Composite indexes on Books for Explore performance
CREATE INDEX Books_status_isFlagged_createdAt_idx 
ON Books(status, isFlagged, createdAt);

CREATE INDEX Books_userId_status_isFlagged_idx 
ON Books(userId, status, isFlagged);