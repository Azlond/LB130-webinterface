import colorTempToHex from "./ColorTempHex";

/**
 * Convert HSV to RGB.
 * @param h - Hue in range [0, 1]
 * @param s - Saturation in range [0, 1]
 * @param v - Value in range [0, 1]
 * @returns RGB values each in range [0, 255]
 */
export function HSVtoRGB(h: number, s: number, v: number): { r: number; g: number; b: number } {
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Convert RGB to HSV.
 * @param r - Red in range [0, 255]
 * @param g - Green in range [0, 255]
 * @param b - Blue in range [0, 255]
 * @returns HSV values each in range [0, 1]
 */
export function RGBtoHSV(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const v = max / 255;
  let h = 0;

  switch (max) {
    case min: h = 0; break;
    case r: h = (g - b + d * (g < b ? 6 : 0)) / (6 * d); break;
    case g: h = (b - r + d * 2) / (6 * d); break;
    case b: h = (r - g + d * 4) / (6 * d); break;
  }

  return { h, s, v };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Look up the hex color for a color temperature in Kelvin.
 * Falls back to 2500K if the value is not in the map (e.g. out-of-range slider input).
 */
export function getColorHex(temp: number): string {
  return (colorTempToHex as Record<number, string>)[temp] ?? colorTempToHex[2500];
}