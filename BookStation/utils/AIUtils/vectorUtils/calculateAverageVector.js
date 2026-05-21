// time complexity O(n * d) n is vectors d is dimensions
// space complexity O(d) for the sum array
function calculateAverageVector(vectors) {
  if (!vectors || vectors.length === 0) return null
  
  const vectorLength = vectors[0].length
  const sumVector = new Array(vectorLength).fill(0)

  for (const vector of vectors) {
    for (let i = 0; i < vectorLength; i++) {
      sumVector[i] += vector[i]
    }
  }
  
  return sumVector.map(val => val / vectors.length)
}

// time complexity O(d) d is vector length
// space complexity O(d) for returning the new blended array
function calculateWeightedBlend(vectorA, weightA, vectorB, weightB) {
  const vectorLength = vectorA.length
  const blendedVector = new Array(vectorLength).fill(0)
  let magnitudeSquared = 0

  for (let i = 0; i < vectorLength; i++) {
    blendedVector[i] = (vectorA[i] * weightA) + (vectorB[i] * weightB)
    magnitudeSquared += blendedVector[i] * blendedVector[i]
  }

  // l2 normalization to ensure vector length is exactly 1 for cosine math later
  const magnitude = Math.sqrt(magnitudeSquared)
  if (magnitude === 0) return blendedVector
  
  return blendedVector.map(val => val / magnitude)
}

module.exports = { calculateAverageVector, calculateWeightedBlend };