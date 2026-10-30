// left/top/width are % of the character image box (ear.png).
// Shoes and socks use "bottom" instead of "top", so their soles meet the feet at any height,
// and "center" so the pair sits in the middle of Ear.
// Measured from Figma-style outfit screenshots. Defaults fit: tee, jeans, sneakers, caps.
export const PLACEMENT = {
  bottom: { left: 26.4, top: 54.7, width: 48, z: 3 },
  socks: { center: true, bottom: 1.4, width: 54, z: 1 },
  shoes: { center: true, bottom: 0.4, width: 57, z: 2 },
  top: { left: 5.5, top: 31.1, width: 89, z: 4 },
  outer: { left: 0, top: 30, width: 100, z: 5 },
  face: { left: 5, top: 17.4, width: 90, z: 6 },
  head: { left: 9.8, top: 1.7, width: 81.6, z: 7 },
};

// Per-item overrides, keyed by item name (the file name without .png).
const WIDE_TOP = { left: 0.5, top: 30.9, width: 99 };
const SWEATER = { left: 0.5, top: 31.3, width: 99 };
const HIGHNECK = { left: 0.5, top: 29.8, width: 99 };
const DRESS = { left: 14.5, top: 31, width: 70.5 };
const HOODIE = { left: 1.3, top: 30.2, width: 97.4 };
const MINI = { left: 24.5, top: 54.5, width: 51 };
// Long pants that end above the shoes are stretched down to "hem" so no leg shows.
const LONG = { hem: 90.5 };
const BLAZER = { left: -1, top: 30.5, width: 102 };
const SNEAKERS = { bottom: 0.4, width: 59 };
const SHIRT = { top: 30.8 };
const DSHOES = { bottom: 0.2, width: 60 };
const BOOTS = { bottom: 0, width: 63 };
const COAT = { left: 0, top: 30.7, width: 98 };
const ITEM_PLACEMENT = {
  // Gray's 489×447 canvas includes stray pixels outside its 446×383 garment.
  // Match black's visible width and hem without scaling the transparent padding.
  "skirt-gray": { width: 48 * 489 / 446, clipPath: "inset(0 8.79% 14.32% 0)" },
  "cardigan-gray": WIDE_TOP,
  "cardigan-red": WIDE_TOP,
  "cardigan-white": WIDE_TOP,
  "sweater-beige": SWEATER,
  "sweater-gray": SWEATER,
  "sweater-navy": { ...SWEATER, top: 30.8 },
  "highneck-black": HIGHNECK,
  "highneck-gray": HIGHNECK,
  "mini-black": MINI,
  "mini-denim": MINI,
  "mini-green": MINI,
  "mini-ivory": MINI,
  "mini-navy": MINI,
  "mini-orange": MINI,
  "dress-black": DRESS,
  "dress-red": DRESS,
  "dress-white": DRESS,
  "hoodie-black": HOODIE,
  "hoodie-gray": HOODIE,
  "hoodie-ivory": HOODIE,
  "coat-black": COAT,
  "coat-camel": COAT,
  "coat-gray": COAT,
  "slacks-black": LONG,
  "slacks-brown": LONG,
  "slacks-ivory": LONG,
  "sweats-black": LONG,
  "sweats-gray": LONG,
  "sweats-ivory": LONG,
  "shirt-bw": SHIRT,
  "shirt-ivory": SHIRT,
  "flats-black": DSHOES,
  "flats-pink": DSHOES,
  "dshoes-black": DSHOES,
  "dshoes-brown": DSHOES,
  "dshoes-ivory": DSHOES,
  "blazer-beige": BLAZER,
  "blazer-black": BLAZER,
  "blazer-ivory": BLAZER,
  "sneakers-black": SNEAKERS,
  "sneakers-charcoal": SNEAKERS,
  "sneakers-red": SNEAKERS,
  "sneakers-white": SNEAKERS,
  "boots-black": BOOTS,
  "boots-ivory": BOOTS,
  "acc-headphone": { left: -3.5, top: 1.3, width: 105 },
  "boots-ugg": { bottom: 0.6, width: 60.5 },
};

export function placementFor(slot, name) {
  return { ...PLACEMENT[slot], ...ITEM_PLACEMENT[name] };
}

export const TABS = [
  { id: "top", label: "Tops" },
  { id: "bottom", label: "Bottoms" },
  { id: "outer", label: "Outers" },
  { id: "acc", label: "Acc" },
  { id: "shoes", label: "Shoes" },
];

const COLORS = { bw: "B&W", ugg: "" };
const TYPES = {
  dshoes: "dress shoes",
  highneck: "high neck",
  mini: "mini",
  slacks: "slacks",
  sweats: "sweatpants",
  "acc-headphone": "headphones",
  "acc-sandal": "sandals",
};
const cap = (w) => (w ? w[0].toUpperCase() + w.slice(1) : w);

// "cardigan-gray" -> "Gray cardigan", "socks-whitelong" -> "White long socks"
function labelFor(name) {
  if (name === "acc-headphone") return "Headphones";
  if (name === "acc-sandal-white") return "White sandals";
  if (name === "boots-ugg") return "Ugg boots";
  if (name === "socks-whitelong") return "White long socks";
  if (name === "socks-blackmini") return "Black mini socks";
  if (name === "glasses-sunblack") return "Black sunglasses";
  if (name === "glasses-sunwhite") return "White sunglasses";
  if (name === "glasses-sunyellow") return "Yellow sunglasses";
  const [type, color = ""] = name.split("-");
  const kind = TYPES[type] || type;
  const hue = color in COLORS ? COLORS[color] : color;
  return cap([hue, hue ? kind : cap(kind)].filter(Boolean).join(" "));
}

const make = (tab, slot, folder, names) =>
  names.map((name) => ({
    id: `${slot}-${name}`,
    tab,
    slot,
    name,
    label: labelFor(name),
    src: `/clothes/${folder}/${name}.png`,
  }));

export const ITEMS = [
  ...make("top", "top", "top", [
    "tee-black", "tee-blue", "tee-white",
    "dress-black", "dress-red", "dress-white",
    "highneck-black", "highneck-gray",
    "hoodie-black", "hoodie-gray", "hoodie-ivory",
    "sweater-beige", "sweater-gray", "sweater-navy",
  ]),
  ...make("bottom", "bottom", "bottom", [
    "jeans-black", "jeans-blue", "jeans-navy", "jeans-red",
    "mini-black", "mini-denim", "mini-green", "mini-ivory", "mini-navy", "mini-orange",
    "shorts-black", "shorts-gray", "shorts-navy", "shorts-red",
    "skirt-black", "skirt-gray", "skirt-red",
    "slacks-beige", "slacks-black", "slacks-brown", "slacks-ivory", "slacks-navy",
    "sweats-black", "sweats-gray", "sweats-ivory",
  ]),
  ...make("outer", "outer", "outer", [
    "blazer-beige", "blazer-black", "blazer-ivory",
    "cardigan-gray", "cardigan-red", "cardigan-white",
    "coat-black", "coat-camel", "coat-gray",
    "puffer-black", "puffer-gray", "puffer-ivory",
    "shirt-bw", "shirt-ivory",
  ]),
  ...make("acc", "head", "acc", [
    "beanie-brown", "beanie-pink", "cap-black", "cap-navy", "cap-white", "acc-headphone",
  ]),
  ...make("acc", "face", "acc", [
    "glasses-black", "glasses-sunblack", "glasses-sunwhite", "glasses-sunyellow", "glasses-white",
  ]),
  ...make("shoes", "shoes", "acc", [
    "boots-black", "boots-ivory", "boots-ugg",
    "dshoes-black", "dshoes-brown", "dshoes-ivory",
    "flats-black", "flats-pink", "acc-sandal-white",
    "sneakers-black", "sneakers-charcoal", "sneakers-red", "sneakers-white",
  ]),
  ...make("shoes", "socks", "acc", [
    "socks-blackmini", "socks-gray", "socks-ivory", "socks-whitelong",
  ]),
];

export const BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));