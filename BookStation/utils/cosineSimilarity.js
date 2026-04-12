// note:cousineSimilarity is the similarity between vectors (basically embed compare)

function cosineSimilarity(vecA, vecB) {

    //initialization  
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

// Hay el loop goes through all the numbers in the vec dimensional arrays
    for ( let i =0; i < vecA.length; i++ ) {
        dotProduct += vecA[i] * vecB[i]; //awal tnen indexs in both vectors
        //complex math research later
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    //similarity chance btsir 0 in this case (lama ykun ma fi embedding b albon)
    // so math error would occar (divided by 0) look at the formula below
    if ( normA ===0 || normB ===0 ) return 0;

    // the cosine formula 
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { cosineSimilarity };