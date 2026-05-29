const BACKEND_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const DEFAULT_AVATAR = false;

/**
 * Resolves a raw file path from the DB (e.g. "uploads/cover/abc.jpg")
 * into a full URL the browser can display or open.
 *
 * Blob URLs (used for live previews) and full http(s) URLs are passed through
 * untouched so we never double-prefix them.
 */
export const resolveDocumentUrl = (filePath) => {
    if (!filePath) return DEFAULT_AVATAR;
    if (filePath.startsWith("blob:") || filePath.startsWith("http")) return filePath;

    const normalized = filePath.replace(/\\/g, "/");
    const clean = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return `${BACKEND_URL}${clean}`;
};

export default { resolveDocumentUrl };

