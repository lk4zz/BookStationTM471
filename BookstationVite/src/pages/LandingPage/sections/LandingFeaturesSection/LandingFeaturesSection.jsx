import { SparklesIcon, CoinsIcon, BookOpenIcon } from "../../../../components/UI/Icons/IconLibrary";
import FeaturesCard from "./components/FeaturesCard/FeaturesCard";
import styles from "./LandingFeaturesSection.module.css";

function LandingFeaturesSection() {
  return (
    <section className={styles.features}>
      <FeaturesCard
        Icon={SparklesIcon}
        header="AI-Powered Experience"
        text="Overcome writer's block with our AI writing assistant, or dive deeper into lore with your personal AI reading partner."
      />
      <FeaturesCard
        Icon={CoinsIcon}
        header="Fair Monetization"
        text="Unlock stories chapter by chapter using coins, or subscribe for unlimited access. Support your favorite authors directly."
      />
      <FeaturesCard
        Icon={BookOpenIcon}
        header="Publish As You Go"
        text="Create an ongoing book and publish chapters in real-time. Build an active audience while your story unfolds."
      />
    </section>
  );
}

export default LandingFeaturesSection;
