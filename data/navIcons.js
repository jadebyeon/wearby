// Paste the "d" strings from each exported SVG into "paths".
// Empty "paths" means the icon uses the old image file (size and color change, line thickness does not).
export const NAV_ICONS = {
  home: { viewBox: "0 0 24 24", paths: [] },
  calendar: {
    viewBox: "0 0 24 27",
    paths: [
      "M16.6667 1.5V6.16667M7.33333 1.5V6.16667M1.5 10.8333H22.5M3.83333 3.83333H20.1667C21.4553 3.83333 22.5 4.878 22.5 6.16667V22.5C22.5 23.7887 21.4553 24.8333 20.1667 24.8333H3.83333C2.54467 24.8333 1.5 23.7887 1.5 22.5V6.16667C1.5 4.878 2.54467 3.83333 3.83333 3.83333Z",
    ],
  },
  insights: { viewBox: "0 0 24 24", paths: [] },
  profile: { viewBox: "0 0 24 24", paths: [] },
};