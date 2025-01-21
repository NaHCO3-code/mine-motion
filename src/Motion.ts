export function lerp(current: number, target: number, rate: number){
  return (1.0 - rate) * current + rate * target;
}

export function damper(current: number, target: number, halflife: number, dt: number){
  return lerp(current, target, 1.0 - Math.pow(2, -dt / halflife));
}