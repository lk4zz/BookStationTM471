import { Link } from "react-router-dom";
import RadarContainer from "../features/tasteMap/components/RadarContainer";

/**
 * Dev / demo route: taste radar only. Easy to delete (route + this file).
 */
export default function RadarTestPage() {
  return (
    <div
      style={{
        padding: "1.25rem 1rem 2rem",
        maxWidth: "1126px",
        margin: "0 auto",
        textAlign: "left",
        minHeight: "100svh",
        boxSizing: "border-box",
      }}
    >
      <p style={{ margin: "0 0 1rem" }}>
        <Link to="/" style={{ color: "var(--accent)" }}>
          ← Home
        </Link>
      </p>

      <RadarContainer />
    </div>
  );
}
