// Prototype records reconstructed from the original memory images.
// Reflections are edited demo copy, not a transcription of user records.
import { BACKGROUNDS } from "@/data/backgrounds";
// Dates and ratings retain the existing demo values.
const PAST = [
  { daysAgo: 1, rating: 4, outfit: { head: "head-cap-navy", top: "top-hoodie-gray", bottom: "bottom-sweats-gray", shoes: "shoes-dshoes-black" } },
  { daysAgo: 2, rating: 5, outfit: { head: "head-acc-headphone", top: "top-dress-white", outer: "outer-cardigan-red", socks: "socks-socks-gray", shoes: "shoes-flats-black" }, keep: "Food was great! I loved the sushi today.", leave: "Maybe not the udon though..." },
  { daysAgo: 4, rating: 3, outfit: { head: "head-acc-headphone", top: "top-dress-white", outer: "outer-cardigan-red", socks: "socks-socks-gray", shoes: "shoes-flats-black" } },
  { daysAgo: 5, rating: 2, outfit: { face: "face-glasses-black", top: "top-sweater-navy", bottom: "bottom-jeans-blue", shoes: "shoes-sneakers-white" } },
  { daysAgo: 7, rating: 5, outfit: { top: "top-hoodie-gray", bottom: "bottom-sweats-gray", shoes: "shoes-dshoes-black" } },
  // The original also has headphones beneath the cap. Dress Up currently supports one head item.
  { daysAgo: 9, rating: 4, outfit: { head: "head-cap-navy", top: "top-sweater-gray", bottom: "bottom-jeans-blue", shoes: "shoes-sneakers-white" } },
  { daysAgo: 10, rating: 1, outfit: { head: "head-acc-headphone", top: "top-hoodie-gray", bottom: "bottom-jeans-blue", shoes: "shoes-sneakers-white" } },
  { daysAgo: 12, rating: 3, outfit: { top: "top-dress-white", outer: "outer-puffer-black", socks: "socks-socks-gray", shoes: "shoes-flats-black" } },
  { daysAgo: 15, rating: 5, outfit: { head: "head-cap-white", face: "face-glasses-sunblack", outer: "outer-shirt-ivory", bottom: "bottom-shorts-black", shoes: "shoes-sneakers-black" } },
  { daysAgo: 17, rating: 4, outfit: { face: "face-glasses-sunblack", outer: "outer-puffer-black", bottom: "bottom-sweats-gray", shoes: "shoes-sneakers-white" } },
];

// Shuffled once and kept stable so each record retains its background.
const BACKGROUND_ORDER = [0, 15, 8, 7, 6, 11, 5, 2, 12, 13];
const REFLECTIONS = [["A quiet walk helped me slow down.", "I can leave the rush here."], ["Food was great! I loved the sushi today.", "Maybe not the udon though..."], ["My favorite song made the walk better.", "I worried too much about small things."], ["I made time for a short break.", "I do not need to finish it all today."], ["A slow morning felt good.", "I can put my phone away sooner."], ["Coffee with a friend made my day.", "I can stop checking the time."], ["I got through a hard day.", "I can leave the bad mood here."], ["The warm jacket was a good choice.", "Next time I will check the weather."], ["I felt good in this outfit.", "I do not need to overthink it."], ["The fresh air helped clear my head.", "I can rest without feeling guilty."]];

export function pastMemories(today = new Date()) {
  return PAST.map((p, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - p.daysAgo, 20);
    return {
      id: `past-${i + 1}`,
      savedAt: d.toISOString(),
      rating: p.rating,
      outfit: p.outfit,
      background: BACKGROUNDS[BACKGROUND_ORDER[i]].src,
      keep: REFLECTIONS[i][0],
      leave: REFLECTIONS[i][1],
      isSample: true,
      image: `/memories/past-${String(i + 1).padStart(2, "0")}.jpg`,
    };
  });
}
