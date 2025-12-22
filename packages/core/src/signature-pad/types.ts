import type { StrokeOptions } from "perfect-freehand";

export type DrawingOptions = StrokeOptions;

export type DrawingDetails = {
	paths: string[];
};

export type DrawingEndDetails = {
	paths: string[];
	getDataUrl: (options: DataUrlOptions) => Promise<string>;
};

export type SignaturePadRootOptions = {
	disabled?: boolean;
	drawingOptions?: DrawingOptions;
	onDrawing?: (details: DrawingDetails) => void;
	onDrawingEnd?: (details: DrawingEndDetails) => void;
};

export type Point = {
	x: number;
	y: number;
};

export type DataUrlType = "image/png" | "image/jpeg" | "image/svg+xml";

export type DataUrlOptions = {
	type: DataUrlType;
	quality?: number | undefined;
};
