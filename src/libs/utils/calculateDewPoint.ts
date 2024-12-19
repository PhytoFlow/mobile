export const calculateDewPoint = (temp: number, humidity: number): number => {
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * temp) / (b + temp) + Math.log(humidity / 100.0);
  return Number(((b * alpha) / (a - alpha)).toFixed(1));
};
