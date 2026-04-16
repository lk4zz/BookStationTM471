/** Default when there is no history and no `location.state.from`. */
export const DEFAULT_BACK_PATH = "/explore";

/**
 * Router location.state payload so detail pages can return to the list the user came from.
 * Pass as `state={linkStateFromHere(location)}` on `<Link>` or `{ state: linkStateFromHere(location) }` on `navigate`.
 */
export function linkStateFromHere(location) {
  if (!location) return {};
  return { from: `${location.pathname}${location.search || ""}` };
}
