import { getStroke } from "perfect-freehand";
import {
	type Accessor,
	type JSX,
	createContext,
	createSignal,
	createUniqueId,
	useContext,
} from "solid-js";

import { mergeDefaultProps } from "@kobalte/utils";
import { getDataUrl, getSvgPathFromStroke } from "./utils";

import type { DrawingOptions, Point, SignaturePadRootOptions } from "./types";

export type SignaturePadContextValue = {
	disabled: boolean;
	controlId: string;
	signaturePadRef: HTMLDivElement | undefined;
	currentPath: Accessor<string | null>;
	currentPoints: Accessor<Point[]>;
	allPaths: Accessor<string[]>;
	isActiveDrawing: Accessor<boolean>;
	startDrawing: (point: Point, pressure: number) => void;
	continueDrawing: (point: Point, pressure: number) => void;
	endDrawing: () => void;
	clearDrawing: () => void;
	setSignatureSVG: (svg: SVGElement | undefined) => void;
};

type SignaturePadProviderProps = SignaturePadRootOptions & {
	children: JSX.Element;
};

const SignaturePadContext = createContext<SignaturePadContextValue | null>(
	null,
);

export const SignaturePadProvider = (props: SignaturePadProviderProps) => {
	const signaturePadId = createUniqueId();
	const signaturePadRef: HTMLDivElement | undefined = undefined;

	const [currentPoints, setCurrentPoints] = createSignal<Point[]>([]);
	const [currentPath, setCurrentPath] = createSignal<string | null>(null);
	const [allPaths, setAllPaths] = createSignal<string[]>([]);
	const [isActiveDrawing, setIsActiveDrawing] = createSignal<boolean>(false);
	const [signatureSVG, setSignatureSVG] = createSignal<SVGElement | undefined>(
		undefined,
	);

	const mergedProps = mergeDefaultProps(
		{
			disabled: false,
			drawingOptions: {
				size: 2,
				simulatePressure: false,
			},
		},
		props,
	);

	const addPoint = (point: { x: number; y: number; pressure: number }) => {
		setCurrentPoints((prev) => [...prev, { ...point }]);
		const stroke = getStroke(currentPoints(), mergedProps.drawingOptions);
		const currentPath = getSvgPathFromStroke(stroke);
		setCurrentPath(currentPath);
	};

	const startDrawing = (point: Point, pressure: number) => {
		addPoint({ ...point, pressure });
		setIsActiveDrawing(true);
		props.onDrawing?.({
			paths: [...allPaths(), currentPath()!].filter(Boolean),
		});
	};

	const continueDrawing = (point: Point, pressure: number) => {
		addPoint({ ...point, pressure });
		setIsActiveDrawing(true);
		props.onDrawing?.({
			paths: [...allPaths(), currentPath()!].filter(Boolean),
		});
	};

	const endDrawing = () => {
		props.onDrawingEnd?.({
			paths: allPaths().filter(Boolean),
			getDataUrl: () => getDataUrl(signatureSVG()),
		});
		setAllPaths((prev) => [...prev, currentPath()!]);
		setCurrentPoints([]);
		setCurrentPath(null);
		setIsActiveDrawing(false);
	};

	const clearDrawing = () => {
		setCurrentPath(null);
		setAllPaths(() => []);
		setCurrentPoints(() => []);
		setIsActiveDrawing(false);
		props.onDrawingEnd?.({
			paths: allPaths().filter(Boolean),
			getDataUrl: () => getDataUrl(signatureSVG()),
		});
	};

	const value: SignaturePadContextValue = {
		disabled: mergedProps.disabled,
		controlId: signaturePadId,
		isActiveDrawing,
		signaturePadRef,
		currentPoints,
		currentPath,
		allPaths,
		startDrawing,
		continueDrawing,
		endDrawing,
		clearDrawing,
		setSignatureSVG,
	};

	return (
		<SignaturePadContext.Provider value={value}>
			{props.children}
		</SignaturePadContext.Provider>
	);
};

export const useSignaturePadContext = () => {
	const context = useContext(SignaturePadContext);

	if (!context) {
		throw new Error(
			"[kobalte]: `useSignaturePadContext` must be used within a `SignaturePadContext.Root` component",
		);
	}

	return context;
};
