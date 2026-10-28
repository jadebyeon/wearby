// Default backgrounds. The files live in public/backgrounds/ (web-sized copies, 1400px).
// File names stay lowercase, because Vercel is case sensitive.
// Add a number here when you add a file like bg-21.jpg.
const NUMBERS = [1, 2, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export const BACKGROUNDS = NUMBERS.map((n, i) => {
  const id = `bg-${String(n).padStart(2, "0")}`;
  return { id, name: `Background ${i + 1}`, src: `/backgrounds/${id}.jpg` };
});
