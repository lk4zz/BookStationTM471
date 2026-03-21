const BadRequestError = require('../errors/BadRequestError');

const validateChapterPricing = (pages, requestedPrice, chapterNum) => {
    // calculate the word count from the pages array
    const fullText = pages.map(page => page.text).join(" ");
    const wordCount = fullText.split(/\s+/).filter(word => word.length > 0).length;

    // clean the price input
    let finalPrice;

    if (requestedPrice !== undefined && requestedPrice !== null) {
    finalPrice = parseInt(requestedPrice, 10);
    } else {
    finalPrice = chapter.price; // fallback to existing value
    }

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
            throw new BadRequestError("Invalid pricing", "INVALID_PRICING_TO_WORDCOUNT_RATIO"), wordCount, maxAllowedPrice;
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