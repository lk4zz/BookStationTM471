function cosineSimilarity(vecA, vecB) {
    // setting up variables to hold the dot product and the lengths of both vectors
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    
    // loop through every single dimension in the embedding arrays (384) 
    for (let i = 0; i < vecA.length; i++) {
        // multiply the matching dimensions together and add them to our running total
        dotProduct += vecA[i] * vecB[i]; 
        
        // square the current dimension value to build up the total magnitude of vector a
        normA += vecA[i] * vecA[i];
        
        // do the exact same thing to build up the magnitude for vector b
        normB += vecB[i] * vecB[i];
    }

    // if either vector is completely empty it means length is zero so we return zero
    // doing this prevents the math from crashing when dividing by zero later
    if (normA === 0 || normB === 0) return 0;

    // finalize the formula by dividing the dot product by the actual lengths of the vectors
    // we use square root here to finish the magnitude calculation from inside the loop
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { cosineSimilarity };