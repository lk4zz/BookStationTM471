import styles from './GenreBox.module.css'
import { useNavigate } from 'react-router-dom';

function GenreBox({ genre }) {
    const navigate = useNavigate()
      const genreColorMap = {
      action: "#630101",    // Red
      fantasy: "#40007c",   // Purple
      romance: "#610032",   // Pink
      scifi: "#0053d8",     // Blue
      horror: "#111827",    // Dark Gray/Black
      comedy: "#eab308",    // Yellow
      mystery: "#14b8a6",   // Teal
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