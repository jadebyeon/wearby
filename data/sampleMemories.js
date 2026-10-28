// Prototype data: days ago + image. Dates are computed from today.
// Images repeat until there are enough real memories.
const SAMPLE = [1, 2, 3, 4, 5, 6, 7].map((daysAgo, i) => ({
  daysAgo,
  src: ["/memories/mem-0309.png", "/memories/mem-0308.png", "/memories/mem-0306.png"][i % 3],
}));

export function sampleMemories() {
  const today = new Date();
  return SAMPLE.map(({ daysAgo, src }) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
    const date = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
    return { date, src };
  });
}
