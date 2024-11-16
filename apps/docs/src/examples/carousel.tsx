import styles from "./carousel.module.css";
import { Carousel } from "@kobalte/core/carousel";
import { Index } from "solid-js";
import Autoplay from "embla-carousel-autoplay"

const slides = Array.from({ length: 5 }).map((_, i) => i + 1);

export function HorrizontalExample() {
	return (
		<div class={styles.horizontal}>
			<Carousel
				orientation="horizontal"
				class={styles.root}
				options={{
					align: "start",
					loop: false,
				}}
			>
				<Carousel.Viewport class={styles.viewport}>
					<Index each={slides}>
						{(_, index) => (
							<Carousel.Item class={styles.item} index={index}>
								Slide {index}
							</Carousel.Item>
						)}
					</Index>
				</Carousel.Viewport>

				<div class={styles.indicators}>
					<Carousel.Previous class={styles.button}>Prev</Carousel.Previous>
					<Index each={slides}>
						{(_, index) => (
							<Carousel.Indicator
								class={styles.indicator}
								index={index}
								aria-label={`Go to slide ${index + 1}`}
							/>
						)}
					</Index>
					<Carousel.Next class={styles.button}>Next</Carousel.Next>
				</div>
			</Carousel>
		</div>
	);
}

export function VerticalExample() {
	return (
		<div class={styles.vertical}>
			<Carousel
				orientation="vertical"
				class={styles.root}
				options={{
					align: "start",
					loop: false,
				}}
			>
				<Carousel.Viewport class={styles.viewport}>
					<Index each={slides}>
						{(_, index) => (
							<Carousel.Item class={styles.item} index={index}>
								Slide {index}
							</Carousel.Item>
						)}
					</Index>
				</Carousel.Viewport>

				{
					<div class={styles.indicators}>
						<Index each={slides}>
							{(_, index) => (
								<Carousel.Indicator
									class={styles.indicator}
									index={index}
									aria-label={`Go to slide ${index + 1}`}
								/>
							)}
						</Index>
					</div>
				}
			</Carousel>
		</div>
	);
}

export function AutoPlayExample() {
	const autoPlayPlugin = Autoplay({ delay: 1800, stopOnInteraction: true });
	return (
		<div class={styles.horizontal}>
			<Carousel
				orientation="horizontal"
				plugins={[autoPlayPlugin]}
				onMouseEnter={autoPlayPlugin.stop}
				onMouseLeave={() => autoPlayPlugin.play(false)}
				class={styles.root}
				options={{
					align: "start",
					loop: false,
				}}
			>
				<Carousel.Viewport class={styles.viewport}>
					<Index each={slides}>
						{(_, index) => (
							<Carousel.Item class={styles.item} index={index}>
								Slide {index}
							</Carousel.Item>
						)}
					</Index>
				</Carousel.Viewport>

				<div class={styles.indicators}>
					<Carousel.Previous class={styles.button}>Prev</Carousel.Previous>
					<Index each={slides}>
						{(_, index) => (
							<Carousel.Indicator
								class={styles.indicator}
								index={index}
								aria-label={`Go to slide ${index + 1}`}
							/>
						)}
					</Index>
					<Carousel.Next class={styles.button}>Next</Carousel.Next>
				</div>
			</Carousel>
		</div>
	);
}
