const BadRequestError = require('../errors/BadRequestError');

/** Strip HTML tags for word-count (pages may store Tiptap HTML). */
const stripHtml = (html) =>
  String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const validateChapterPricing = (pages, requestedPrice, chapterNum) => {
    // calculate the word count from the pages array
    const fullText = pages.map((page) => stripHtml(page.text)).join(" ");
    const wordCount = fullText.split(/\s+/).filter((word) => word.length > 0).length;

    // clean the price input
    let finalPrice = parseInt(requestedPrice, 10);
    if (isNaN(finalPrice)) finalPrice = 0;
 
    if (finalPrice < 0) throw new BadRequestError("PRICE CANNOT BE NEGATIVE.");

    // enforce the constraints
    if (chapterNum === 1) {
        finalPrice = 0; // Absolute rule: First chapter is always free
    } else {
        // Determine the MAX ceiling based on word count
        let maxAllowedPrice = 0;
        
        if (wordCount <= 500) maxAllowedPrice = 10;
        else if (wordCount <= 1000) maxAllowedPrice = 20;
        else if (wordCount <= 2000) maxAllowedPrice = 35;
        else if (wordCount <= 3500) maxAllowedPrice = 50;
        else maxAllowedPrice = 70; 

        // enforce the ceiling
        if (finalPrice > maxAllowedPrice) {
            const pricingError = new Error("Invalid pricing");
            pricingError.code = "INVALID_PRICING_TO_WORDCOUNT_RATIO";
            pricingError.wordCount = wordCount;
            pricingError.maxAllowedPrice = maxAllowedPrice;
            
            throw pricingError;
        }
    }

    // return the calculated data safely
    return {
        finalPrice,
        isLocked: finalPrice > 0,
        wordCount
    };
};

module.exports = {
    validateChapterPricing
};