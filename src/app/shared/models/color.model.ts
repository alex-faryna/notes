export interface Color {
  id: number;
  color: string;
}

export const COLORS = [
  "#ffffff",
  "#ff5634",
  "#53de33",
  "#5678ff",
  "#ffac23",
  "#ffee23"
];

export const THEME_COLORS = COLORS.map((color, id) => ({id, color}));
