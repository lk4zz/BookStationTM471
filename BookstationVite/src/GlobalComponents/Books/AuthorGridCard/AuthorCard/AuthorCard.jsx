import { useLocation, useNavigate } from "react-router-dom";
import styles from "./AuthorCard.module.css";
import { linkStateFromHere } from "../../../../utils/navigation.js";
import { resolveDocumentUrl } from "../../../../utils/ImageUrl";
import UserAvatar from "../../../Layout/UserAvatar/UserAvatar";

//the author card component when searching
function AuthorCard({ author }) {
  
  const navigate = useNavigate();
  const location = useLocation();

  if (!author) return null;

  const handleClick = () => {
    navigate(`/author/${author.id}`, { state: linkStateFromHere(location) });
  };

  const profileUrl = resolveDocumentUrl(author?.profileImage);

  return (
    <div className={styles.authorCard} onClick={handleClick}>
      <div className={styles.avatarWrapper}>
        <UserAvatar profileUrl={profileUrl} />
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{author.name}</h4>
        {author.bio && <p className={styles.bio}>{author.bio}</p>}
      </div>
    </div>
  );
}

export default AuthorCard;