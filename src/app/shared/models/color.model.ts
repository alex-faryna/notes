export interface Color {
  id: number;
  color: string;
}

export interface ColorBubble {
  color: Color;
  event: MouseEvent;
}

export const COLORS = [
  "#ff7459",
  "#81d26e",
  "#5678ff",
  "#fdbc59",
  "#fdf375",
  "#424242"
];

export const THEME_COLORS = COLORS.map((color, id) => ({id, color}));

export const getContrastColor = (hex: string) => {
  hex = hex.charAt(0) === "#" ? hex.substring(1,7) : hex;
  const colorBrightness = hexToCol(hex, 0, 299) + hexToCol(hex, 2, 587) + hexToCol(hex, 4, 114);
  return colorBrightness > 130000 ? "#000000" : "#ffffff"
}

const hexToCol = (hex: string, idx: number, mult: number): number => {
  return parseInt(hex.substring(idx,idx + 2),16) * mult;
}
