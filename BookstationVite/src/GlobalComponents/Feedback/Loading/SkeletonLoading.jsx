import styles from "./SkeletonLoading.module.css";

const SHAPES = {
  image: { height: "220px", width: "100%", className: "" },
  title: { height: "24px", width: "72%", className: "" },
  text: { height: "14px", width: "100%", className: "muted" },
  avatar: { height: "44px", width: "44px", className: "avatar" },
};

function resolveLayoutItem(item) {
  if (typeof item === "string") {
    return SHAPES[item] ?? SHAPES.text;
  }

  if (!item || typeof item !== "object") {
    return SHAPES.text;
  }

  const preset = SHAPES[item.type] ?? {};
  return {
    ...preset,
    ...item,
    className: [preset.className, item.className].filter(Boolean).join(" "),
  };
}

/**
 * Global skeleton builder for future loading UIs.
 * Keep route/page code clean by defining shapes via `layout`.
 */
export default function SkeletonLoading({ layout = ["text", "text"], gap, className }) {
  const normalizedLayout = layout.map(resolveLayoutItem);

  return (
    <div
      className={[styles.container, className].filter(Boolean).join(" ")}
      style={gap ? { gap } : undefined}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading content"
    >
      {normalizedLayout.map((item, index) => {
        const mergedClassName = [styles.item, item.className ? styles[item.className] : ""]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={`${item.type ?? "shape"}-${index}`}
            className={mergedClassName}
            style={{
              height: item.height ?? "16px",
              width: item.width ?? "100%",
              borderRadius: item.borderRadius,
            }}
          />
        );
      })}
    </div>
  );
}
