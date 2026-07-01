import { SignaturePad } from "@kobalte/core/signature-pad";
import { Show, createSignal } from "solid-js";

import styles from "./signature-pad.module.css";

export function BasicExample() {
	return (
		<SignaturePad
			class={styles["signature-pad-root"]}
			onDrawing={(details) => console.log("onDrawing", details)}
			onDrawingEnd={async (details) => {
				console.log("onDrawingEnd", details);
			}}
		>
			<SignaturePad.Label class={styles["signature-pad-label"]}>
				Sign here
			</SignaturePad.Label>
			<SignaturePad.Control class={styles["signature-pad-control"]}>
				<SignaturePad.Segment class={styles["signature-pad-segment"]} />
				<SignaturePad.ClearTrigger
					class={styles["signature-pad-clear-trigger"]}
				>
					&#x21bb;
				</SignaturePad.ClearTrigger>
				<SignaturePad.Guide class={styles["signature-pad-guide"]} />
			</SignaturePad.Control>
		</SignaturePad>
	);
}

export function ImagePreviewExample() {
	const [imageUrl, setImageUrl] = createSignal<string>();

	return (
		<>
			<SignaturePad
				class={styles["signature-pad-root"]}
				onDrawing={(details) => console.log("onDrawing", details)}
				onDrawingEnd={async (details) => {
					console.log("onDrawingEnd", details);
					details.getDataUrl({ type: "image/png" }).then((dataUrl) => {
						setImageUrl(dataUrl);
					});
				}}
			>
				<SignaturePad.Label class={styles["signature-pad-label"]}>
					Sign here
				</SignaturePad.Label>
				<SignaturePad.Control class={styles["signature-pad-control"]}>
					<SignaturePad.Segment class={styles["signature-pad-segment"]} />
					<SignaturePad.ClearTrigger
						class={styles["signature-pad-clear-trigger"]}
					>
						&#x21bb;
					</SignaturePad.ClearTrigger>
					<SignaturePad.Guide class={styles["signature-pad-guide"]} />
				</SignaturePad.Control>
				<SignaturePad.HiddenInput name="signature" value={imageUrl()} />
			</SignaturePad>
			<div class={styles["signature-pad-image-container"]}>
				<div>Image Preview:</div>
				<Show when={imageUrl()}>
					<img
						src={imageUrl()}
						alt="Signature"
						class={styles["signature-pad-image-preview"]}
					/>
				</Show>
			</div>
		</>
	);
}

export function HTMLFormExample() {
	let formRef: HTMLFormElement | undefined;

	const [imageUrl, setImageUrl] = createSignal<string>();

	return (
		<form
			class={styles["form-container"]}
			onSubmit={(event) => {
				event.preventDefault();
				const formData = new FormData(formRef);
				alert("you will get an image data url on submit");
				console.log("formData", formData.get("signature"));
			}}
			ref={formRef}
		>
			<SignaturePad
				class={styles["signature-pad-root"]}
				onDrawing={(details) => console.log("onDrawing", details)}
				onDrawingEnd={async (details) => {
					console.log("onDrawingEnd", details);
					details.getDataUrl({ type: "image/png" }).then((dataUrl) => {
						setImageUrl(dataUrl);
					});
				}}
			>
				<SignaturePad.Label class={styles["signature-pad-label"]}>
					Sign here
				</SignaturePad.Label>
				<SignaturePad.Control class={styles["signature-pad-control"]}>
					<SignaturePad.Segment class={styles["signature-pad-segment"]} />
					<SignaturePad.ClearTrigger
						class={styles["signature-pad-clear-trigger"]}
					>
						&#x21bb;
					</SignaturePad.ClearTrigger>
					<SignaturePad.Guide class={styles["signature-pad-guide"]} />
				</SignaturePad.Control>
				<SignaturePad.HiddenInput name="signature" value={imageUrl()} />
			</SignaturePad>
			<button type="submit" class={styles["submit-btn"]}>
				Submit
			</button>
		</form>
	);
}
