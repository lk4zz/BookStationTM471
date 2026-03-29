const BACKEND_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const DEFAULT_AVATAR = "/default-avatar.png";

/**
 * Resolves a raw image path from the DB (e.g. "uploads/cover/abc.jpg")
 * into a full URL the browser can display.
 *
 * Blob URLs (used for live previews) and full http(s) URLs are passed through
 * untouched so we never double-prefix them.
 */
export const resolveImageUrl = (imagePath) => {
    if (!imagePath) return DEFAULT_AVATAR;
    if (imagePath.startsWith("blob:") || imagePath.startsWith("http")) return imagePath;

    const clean = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${BACKEND_URL}${clean}`;
};

export default { resolveImageUrl };

