/**
 * ML Helper Utils
 * Contains logic-based algorithms to simulate AI features.
 */

// Keywords mapping for auto-categorization
const CATEGORY_KEYWORDS = {
  Technology: ['wifi', 'internet', 'network', 'computer', 'printer', 'software', 'login', 'server', 'slow'],
  Hostel: ['room', 'bed', 'mess', 'food', 'water', 'bathroom', 'clean', 'laundry', 'warden'],
  Academic: ['class', 'lecture', 'exam', 'grade', 'professor', 'library', 'book', 'attendance'],
  Infrastructure: ['ac', 'fan', 'light', 'chair', 'desk', 'broken', 'wall', 'door', 'window', 'electricity'],
  Transport: ['bus', 'shuttle', 'driver', 'parking', 'late', 'route']
};

/**
 * Analyzes description text and returns the most likely category.
 * Uses keyword frequency matching.
 */
export const predictCategory = (text) => {
  if (!text) return null;
  const lowerText = text.toLowerCase();
  let bestCategory = null;
  let maxMatches = 0;

  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  });

  return bestCategory; // Returns category name or null if no matches
};

/**
 * Calculates a simple similarity score between two strings (0-100).
 * Uses Jaccard Index logic on words.
 */
export const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;

  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return Math.round((intersection.size / union.size) * 100);
};

/**
 * Calculates "Impact Score" based on engagement metrics.
 */
export const calculateImpactScore = (votes, views, comments) => {
  const voteWeight = 5;
  const commentWeight = 3;
  const viewWeight = 0.1;

  return Math.round((votes * voteWeight) + (comments * commentWeight) + (views * viewWeight));
};

export default { predictCategory, calculateSimilarity, calculateImpactScore };