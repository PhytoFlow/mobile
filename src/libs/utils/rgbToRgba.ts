export const rgbToRgba = (rgb: string, opacity = 1) => {
  return rgb.replace("rgb", "rgba").replace(")", `, ${opacity})`);
};
