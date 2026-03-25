import { SparklesIcon } from "../UI/IconLibrary";
import styles from './FeaturesCard.module.css'

function FeaturesCard({header, text, Icon}) {
    return(
               <div className={styles.featureCard}>
                 <div className={styles.featureIconWrapper}>
                   <Icon className={styles.featureIcon} />
                 </div>
                 <h3>{header}</h3>
                 <p>{text}</p>
               </div>
    )
}

export default FeaturesCard;