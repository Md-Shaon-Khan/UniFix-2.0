const { Op } = require('sequelize');
const { Complaint } = require('../../models');

/**
 * Jaccard Similarity Index
 * Measures similarity between two sets of data.
 * Formula: (Intersection) / (Union)
 */
const calculateJaccardSimilarity = (str1, str2) => {
    const set1 = new Set(str1.toLowerCase().split(/\s+/));
    const set2 = new Set(str2.toLowerCase().split(/\s+/));

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    if (union.size === 0) return 0;
    return (intersection.size / union.size) * 100;
};

exports.checkDuplicate = async (newText, category) => {
    try {
        // 1. Fetch only relevant complaints (same category, active status)
        // This optimizes performance by not scanning the entire DB
        const existingComplaints = await Complaint.findAll({
            where: {
                category: category,
                status: { [Op.notIn]: ['Resolved', 'Closed'] } // Only check open issues
            },
            attributes: ['id', 'title', 'description']
        });

        const potentialDuplicates = [];

        // 2. Compare new text against existing records
        for (const complaint of existingComplaints) {
            const existingText = `${complaint.title} ${complaint.description}`;
            const similarity = calculateJaccardSimilarity(newText, existingText);

            if (similarity > 30) { // Threshold: 30% similarity
                potentialDuplicates.push({
                    id: complaint.id,
                    title: complaint.title,
                    similarity: Math.round(similarity)
                });
            }
        }

        // 3. Sort by highest similarity
        return potentialDuplicates.sort((a, b) => b.similarity - a.similarity).slice(0, 3);

    } catch (error) {
        console.error("Duplicate Detection Error:", error);
        return [];
    }
};