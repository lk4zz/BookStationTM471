import styles from './GenreBox.module.css'
import { useNavigate } from 'react-router-dom';

function GenreBox({ genre }) {
    const navigate = useNavigate()
      const genreColorMap = {
      Action: "#630101",    // Red
      Fantasy: "#40007c",   // Purple
      Romance: "#610032",   // Pink
      Scifi: "#0053d8",     // Blue
      Horror: "#111827",    // Dark Gray/Black
      Comedy: "#eab308",    // Yellow
      Mystery: "#14b8a6",   // Teal
    };
    const bgColor = genreColorMap[genre.type] || "#3f3f46";
    return (
        <div className={styles.GenreBox}
           style={{ background: `linear-gradient(259deg, color-mix(in srgb, ${bgColor} 70%, #ffffff), ${bgColor})`,
            color: "white" }}
            onClick= {() => navigate(`/books/${genre.type}`)}>
            {genre.type}    
        </div>  
    )
}

export default GenreBox;