export function roundToStep(value: number, step: number): number {
	return Math.round(value / step) * step;
}

export function mod(n: number, m: number) {
	return ((n % m) + m) % m;
}

export function roundDown(v: number) {
	const r = Math.floor(v);
	if (r === v) {
		return v - 1;
	}
	return r;
}

export function degToRad(deg: number) {
	return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number) {
	return (rad * 180) / Math.PI;
}

export function angleToCartesian(
	angle: number,
	radius: number,
): { x: number; y: number } {
	const rad = degToRad(360 - angle + 90);
	const x = Math.sin(rad) * radius;
	const y = Math.cos(rad) * radius;
	return { x, y };
}

export function cartesianToAngle(x: number, y: number, radius: number): number {
	const deg = radToDeg(Math.atan2(y / radius, x / radius));
	return (deg + 360) % 360;
}
