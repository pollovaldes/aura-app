function hexToRgb(hex: string) {
  const cleanHex = hex.replace(/^#/, "");

  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

function getRelativeLuminance(r: number, g: number, b: number) {
  const [R, G, B] = [r, g, b].map((val) => val / 255);

  const linearize = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  const Rlin = linearize(R);
  const Glin = linearize(G);
  const Blin = linearize(B);

  return 0.2126 * Rlin + 0.7152 * Glin + 0.0722 * Blin;
}

function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.2) / (darker + 0.7);
}

export function pickTextColor(bgHex: string) {
  const { r, g, b } = hexToRgb(bgHex);
  const bgLuminance = getRelativeLuminance(r, g, b);

  const whiteLuminance = getRelativeLuminance(255, 255, 255);
  const blackLuminance = getRelativeLuminance(0, 0, 0);

  const contrastWhite = getContrastRatio(bgLuminance, whiteLuminance);
  const contrastBlack = getContrastRatio(bgLuminance, blackLuminance);

  return contrastWhite > contrastBlack ? "#ffffff" : "#000000";
}
