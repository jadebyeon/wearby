// Prototype past records for the Calendar. Each one is a finished memory card (Ear, rating and
// notes are already drawn in the picture), so the Calendar just shows the picture.
// Dates are counted back from today, so the Calendar is never empty in a demo.
const PAST = [
  { daysAgo: 1, rating: 4 },
  { daysAgo: 2, rating: 5 },
  { daysAgo: 4, rating: 3 },
  { daysAgo: 5, rating: 2 },
  { daysAgo: 7, rating: 5 },
  { daysAgo: 9, rating: 4 },
  { daysAgo: 10, rating: 1 },
  { daysAgo: 12, rating: 3 },
  { daysAgo: 15, rating: 5 },
  { daysAgo: 17, rating: 4 },
];

export function pastMemories(today = new Date()) {
  return PAST.map((p, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - p.daysAgo, 20);
    return {
      id: `past-${i + 1}`,
      savedAt: d.toISOString(),
      rating: p.rating,
      image: `/memories/past-${String(i + 1).padStart(2, "0")}.jpg`,
    };
  });
}
