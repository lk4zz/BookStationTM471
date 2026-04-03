/** Matches ReadingCanvas.module.css — keep in sync when changing page layout. */

export const PAGE_MAX_WIDTH_PX = 750;
export const PAGE_ASPECT_RATIO = 210 / 420;
export const PAGE_PADDING_X_PX = 56;
export const PAGE_PADDING_Y_PX = 48;

/**
 * @param {number} wrapperInnerWidthPx — content width inside `.paperWrapper` (padding excluded)
 */
export function getReadingContentBox(wrapperInnerWidthPx) {
  const sheetWidth = Math.min(
    PAGE_MAX_WIDTH_PX,
    Math.max(280, wrapperInnerWidthPx)
  );
  const sheetHeight = sheetWidth / PAGE_ASPECT_RATIO;
  const contentWidth = sheetWidth - 2 * PAGE_PADDING_X_PX;
  const contentHeight = sheetHeight - 2 * PAGE_PADDING_Y_PX;
  return { sheetWidth, sheetHeight, contentWidth, contentHeight };
}
