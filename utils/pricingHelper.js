const BadRequestError = require('../errors/BadRequestError');

const validateChapterPricing = (pages, requestedPrice, chapterNum) => {
    // calculate the word count from the pages array
    const fullText = pages.map(page => page.text).join(" ");
    const wordCount = fullText.split(/\s+/).filter(word => word.length > 0).length;

    // clean the price input
    let finalPrice = requestedPrice !== undefined && requestedPrice !== null 
        ? parseInt(requestedPrice, 10) 
        : 0;

    if (finalPrice < 0) throw new BadRequestError("Price cannot be negative.");

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
            throw new BadRequestError(`Chapter is ${wordCount} word(s). The maximum allowed price is ${maxAllowedPrice} coins.`);
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