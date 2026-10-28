// Placeholder numbers for the Insights screen. The screen reads the same shape from props,
// so real numbers made from the saved memories can replace this later.
// delta: how many more outfits than the range before. avgRating: average of the stars.
// ratingCounts: how many outfits got 5, 4, 3, 2 and 1 stars.
// perDay: how many outfits were saved on each day of the range (oldest first)
// weekdays: Mon to Sun
export const INSIGHTS_SAMPLE = {
  "7d": {
    label: "this week",
    saved: 5,
    delta: 2,
    avgRating: 4.2,
    ratingCounts: [2, 2, 1, 0, 0],
    perDay: [1, 1, 0, 1, 1, 0, 1],
    streak: 3,
    bestStreak: 4,
    types: [
      { name: "Hoodie", count: 2 },
      { name: "Jeans", count: 2 },
      { name: "Sneakers", count: 1 },
    ],
    topColor: { name: "Gray", hex: "#8a8a8a" },
    weekdays: [1, 0, 1, 0, 1, 1, 1],
  },
  "30d": {
    label: "this month",
    saved: 18,
    delta: 3,
    avgRating: 3.8,
    ratingCounts: [6, 6, 4, 1, 1],
    perDay: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    streak: 3,
    bestStreak: 6,
    types: [
      { name: "Hoodie", count: 6 },
      { name: "Jeans", count: 5 },
      { name: "Puffer", count: 3 },
    ],
    topColor: { name: "Gray", hex: "#8a8a8a" },
    weekdays: [3, 2, 4, 2, 3, 2, 2],
  },
};
