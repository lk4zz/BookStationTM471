function calculateAverageVector(vectors) {

    if (!vectors || vectors.length === 0) return null;

    const vectorLength = vectors[0].length; //should be 384
    const sumVector = new Array(vectorLength).fill(0);

    for (const vector of vectors) {
        for (let i = 0; i < vectorLength; i++) {

            //sum vector is the new vector array with all the values and indexes inside all vectors summed
            sumVector[i] += vector[i];

        }
    }
    // divide by the number of books to get the average
    return sumVector.map(val => val / vectors.length);
}

module.exports = { calculateAverageVector };