/**
 * Logic-Based Categorizer
 * Analyzes text against a keyword dictionary to determine the best category.
 * This removes the dependency on external Python scripts for stability.
 */

const KEYWORDS = {
    Technology: ['wifi', 'internet', 'network', 'computer', 'printer', 'software', 'login', 'server', 'slow', 'connect'],
    Hostel: ['room', 'bed', 'mess', 'food', 'water', 'bathroom', 'clean', 'laundry', 'warden', 'light', 'fan'],
    Academic: ['class', 'lecture', 'exam', 'grade', 'professor', 'library', 'book', 'attendance', 'lab'],
    Infrastructure: ['ac', 'chair', 'desk', 'broken', 'wall', 'door', 'window', 'electricity', 'power', 'road'],
    Transport: ['bus', 'shuttle', 'driver', 'parking', 'late', 'route', 'seat'],
    Safety: ['security', 'guard', 'theft', 'stolen', 'harassment', 'fight', 'emergency']
};

exports.categorizeText = async (text) => {
    if (!text) return { category: 'Other', confidence: 0, tags: [] };

    const lowerText = text.toLowerCase();
    const scores = {};
    let bestCategory = 'Other';
    let maxScore = 0;
    const foundTags = [];

    // Calculate score for each category
    Object.entries(KEYWORDS).forEach(([category, words]) => {
        let matchCount = 0;
        words.forEach(word => {
            if (lowerText.includes(word)) {
                matchCount++;
                if (!foundTags.includes(word)) foundTags.push(word);
            }
        });
        
        if (matchCount > 0) {
            scores[category] = matchCount;
            if (matchCount > maxScore) {
                maxScore = matchCount;
                bestCategory = category;
            }
        }
    });

    // Calculate pseudo-confidence (capped at 95%)
    const confidence = maxScore > 0 ? Math.min(95, 50 + (maxScore * 10)) : 0;

    return {
        category: bestCategory,
        confidence: confidence,
        tags: foundTags.slice(0, 5) // Return top 5 matched keywords as tags
    };
};