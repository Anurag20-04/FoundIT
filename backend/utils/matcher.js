/**
 * Smart Matcher Utility
 * Compares two items to see if they are a potential match.
 */
const matchItems = (item1, item2) => {
  // 1. Categories MUST match
  if (item1.category.toLowerCase() !== item2.category.toLowerCase()) {
    return false;
  }

  // 2. Simple Location check (You can make this smarter later with Google Maps)
  const loc1 = item1.location.toLowerCase().trim();
  const loc2 = item2.location.toLowerCase().trim();
  
  // Check if one location string contains the other (e.g., "Mumbai" in "Andheri, Mumbai")
  const isLocationMatch = loc1.includes(loc2) || loc2.includes(loc1);

  if (!isLocationMatch) return false;

  // 3. Keyword matching in Titles
  const words1 = item1.title.toLowerCase().split(/\s+/);
  const words2 = item2.title.toLowerCase().split(/\s+/);
  
  // Find common words (excluding short words like 'a', 'the', 'is')
  const commonWords = words1.filter(word => 
    word.length > 2 && words2.includes(word)
  );

  // If they share at least one significant keyword (like "iPhone" or "MacBook")
  return commonWords.length > 0;
};

module.exports = matchItems;