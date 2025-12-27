const categorizer = require('../services/mlService/categorizer');

exports.categorize = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    // Use the logic-based categorizer (No Python needed)
    const result = await categorizer.categorizeText(text);
    
    res.json(result);
  } catch (err) {
    console.error("ML Controller Error:", err);
    res.status(500).json({ error: 'Categorization failed' });
  }
};