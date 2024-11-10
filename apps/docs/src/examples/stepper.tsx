import { Stepper } from "@kobalte/core/stepper"
import { Show, createSignal, For } from "solid-js";
import style from "./stepper.module.css";

export const BasicExample = () => {
	return (
		<Stepper class={style.stepper__root} maxSteps={3} defaultStep={0}>
			<Stepper.List class={style.stepper__list}>
				<For each={[0, 1, 2]}>
					{(index) => (
						<>
							<Stepper.Item class={style.stepper__item} index={index}>
								<Stepper.Trigger class={style.stepper__trigger} step={index}>
									{index + 1}
								</Stepper.Trigger>
							</Stepper.Item>

							<Show when={index < 2}>
								<Stepper.Separator class={style.stepper__separator} />
							</Show>
						</>
					)}
				</For>
			</Stepper.List>

			<div class={style.stepper__content}>
				<Stepper.Content index={0}>
					<h2 class={style.stepper__title}>Step 1</h2>
					<p>This is the content for step 1</p>
				</Stepper.Content>

				<Stepper.Content index={1}>
					<h2 class={style.stepper__title}>Step 2</h2>
					<p>This is the content for step 2</p>
				</Stepper.Content>

				<Stepper.Content index={2}>
					<h2 class={style.stepper__title}>Step 3</h2>
					<p>This is the content for step 3</p>
				</Stepper.Content>
			</div>

			<div class={style.stepper__actions}>
				<Stepper.PrevTrigger class={style.stepper__button}>
					Previous
				</Stepper.PrevTrigger>
				<Stepper.NextTrigger class={style.stepper__button__next}>
					Next
				</Stepper.NextTrigger>
			</div>
		</Stepper>
	);
};

export const FormExample = () => {
	const [currentStep, setCurrentStep] = createSignal(0);
	const [formData, setFormData] = createSignal({
		name: "",
		email: "",
		address: ""
	});

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		// Handle form submission
		console.log("Form submitted:", formData());
	};

	return (
		<Stepper
			class={style.stepper__root}
			maxSteps={3}
			step={currentStep()}
			onStepChange={setCurrentStep}
		>
			<Stepper.List class={style.stepper__list}>
				<Stepper.Item index={0} class={style.stepper__item}>
					<Stepper.Trigger
						step={0}
						class={style.stepper__trigger}
					>
						1
					</Stepper.Trigger>
					<span class={style.stepper__label}>Personal</span>
				</Stepper.Item>

				<Stepper.Separator class={style.stepper__separator} />

				<Stepper.Item index={1} class={style.stepper__item}>
					<Stepper.Trigger
						step={1}
						class={style.stepper__trigger}
					>
						2
					</Stepper.Trigger>
					<span class={style.stepper__label}>Contact</span>
				</Stepper.Item>

				<Stepper.Separator class={style.stepper__separator} />

				<Stepper.Item index={2} class={style.stepper__item}>
					<Stepper.Trigger
						step={2}
						class={style.stepper__trigger}
					>
						3
					</Stepper.Trigger>
					<span class={style.stepper__label}>Review</span>
				</Stepper.Item>
			</Stepper.List>

			<form onSubmit={handleSubmit}>
				<Stepper.Content index={0}>
					<h2 class={style.stepper__title}>Personal Information</h2>
					<input
						type="text"
						placeholder="Full Name"
						value={formData().name}
						onInput={(e) => setFormData({ ...formData(), name: e.currentTarget.value })}
						class={style.stepper__input}
					/>
				</Stepper.Content>

				<Stepper.Content index={1}>
					<h2 class={style.stepper__title}>Contact Information</h2>
					<input
						type="email"
						placeholder="Email"
						value={formData().email}
						onInput={(e) => setFormData({ ...formData(), email: e.currentTarget.value })}
						class={style.stepper__input}
					/>
				</Stepper.Content>

				<Stepper.Content index={2}>
					<h2 class={style.stepper__title}>Review Information</h2>
					<div class={style.stepper__review}>
						<p>Name: {formData().name}</p>
						<p>Email: {formData().email}</p>
					</div>
				</Stepper.Content>

				<Stepper.CompletedContent>
					<div class={style.stepper__completed}>
						<h2>All steps completed!</h2>
						<p>Thank you for submitting your information.</p>
					</div>
				</Stepper.CompletedContent>

				<div class={style.stepper__actions}>
					<Stepper.PrevTrigger class={style.stepper__button}>
						Previous
					</Stepper.PrevTrigger>

					<Show
						when={currentStep() === 2}
						fallback={
							<Stepper.NextTrigger class={style.stepper__button__next}>
								Next
							</Stepper.NextTrigger>
						}
					>
						<button
							type="submit"
							class={style.kstepper__button__submit}
						>
							Submit
						</button>
					</Show>
				</div>
			</form>
		</Stepper>
	);
};

export const ValidatedExample = () => {
	const [currentStep, setCurrentStep] = createSignal(0);
	const [errors, setErrors] = createSignal<Record<string, string>>({});
	const [formData, setFormData] = createSignal({
		name: "",
		email: "",
		phone: "",
	});

	const validateStep = (step: number) => {
		const newErrors: Record<string, string> = {};

		if (step === 0) {
			if (!formData().name) {
				newErrors.name = "Name is required";
			} else if (formData().name.length < 2) {
				newErrors.name = "Name must be at least 2 characters";
			}
		}

		if (step === 1) {
			if (!formData().email) {
				newErrors.email = "Email is required";
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData().email)) {
				newErrors.email = "Please enter a valid email address";
			}
		}

		if (step === 2) {
			if (!formData().phone) {
				newErrors.phone = "Phone number is required";
			} else if (!/^\d{10}$/.test(formData().phone.replace(/\D/g, ''))) {
				newErrors.phone = "Please enter a valid 10-digit phone number";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleStepChange = (newStep: number) => {
		if (newStep > currentStep()) {
			if (validateStep(currentStep())) {
				setCurrentStep(newStep);
			}
		} else {
			setCurrentStep(newStep);
		}
	};

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		if (validateStep(2)) {
			console.log("Form submitted:", formData());
		}
	};

	return (
		<Stepper
			class={style.stepper__root}
			maxSteps={3}
			step={currentStep()}
			onStepChange={handleStepChange}
		>
			<Stepper.List class={style.stepper__list}>
				<For each={[
					{ index: 0, label: "Personal" },
					{ index: 1, label: "Contact" },
					{ index: 2, label: "Review" }
				]}>
					{(item, index) => (
						<>
							<Stepper.Item class={style.stepper__item} index={item.index}>
								<Stepper.Trigger class={style.stepper__trigger} step={item.index}>
									{item.index + 1}
								</Stepper.Trigger>
								<span class={style.stepper__label}>{item.label}</span>
							</Stepper.Item>

							<Show when={index() < 2}>
								<Stepper.Separator class={style.stepper__separator} />
							</Show>
						</>
					)}
				</For>
			</Stepper.List>

			<form onSubmit={handleSubmit}>
				<div class={style.stepper__content}>
					<Stepper.Content index={0}>
						<h2 class={style.stepper__title}>Personal Information</h2>
						<div class={style.stepper__inputContainer}>
							<label class={style.stepper__label}>
								<span>Full Name</span>
								<input
									type="text"
									value={formData().name}
									onInput={(e) => setFormData({ ...formData(), name: e.currentTarget.value })}
									class={`${style.stepper__input} ${errors().name ? style.input__error : ""}`}
								/>
								<Show when={errors().name}>
									<span class={style.error}>{errors().name}</span>
								</Show>
							</label>
						</div>
					</Stepper.Content>

					<Stepper.Content index={1}>
						<h2 class={style.stepper__title}>Contact Information</h2>
						<div class={style.stepper__inputContainer}>
							<label class={style.stepper__label}>
								<span>Email Address</span>
								<input
									type="email"
									value={formData().email}
									onInput={(e) => setFormData({ ...formData(), email: e.currentTarget.value })}
									class={`${style.stepper__input} ${errors().email ? style.input__error : ""}`}
								/>
								<Show when={errors().email}>
									<span class={style.error}>{errors().email}</span>
								</Show>
							</label>
						</div>
					</Stepper.Content>

					<Stepper.Content index={2}>
						<h2 class={style.stepper__title}>Phone Number</h2>
						<div class={style.stepper__inputContainer}>
							<label class={style.stepper__label}>
								<span>Phone Number</span>
								<input
									type="tel"
									value={formData().phone}
									onInput={(e) => setFormData({ ...formData(), phone: e.currentTarget.value })}
									class={`${style.stepper__input} ${errors().phone ? style.input__error : ""}`}
									placeholder="1234567890"
								/>
								<Show when={errors().phone}>
									<span class={style.error}>{errors().phone}</span>
								</Show>
							</label>
						</div>
					</Stepper.Content>

					<Stepper.CompletedContent>
						<div class={style.stepper__completed}>
							<div>
								<svg class={style.stepper__icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<h2>Registration Complete!</h2>
							<p>Thank you for submitting your information.</p>
							<div class={style.stepper__summary}>
								<p><strong>Name:</strong> {formData().name}</p>
								<p><strong>Email:</strong> {formData().email}</p>
								<p><strong>Phone:</strong> {formData().phone}</p>
							</div>
						</div>
					</Stepper.CompletedContent>
				</div>

				<div class={style.stepper__actions}>
					<Stepper.PrevTrigger
						class={style.stepper__button}
						data-disabled={currentStep() === 0}
					>
						Previous
					</Stepper.PrevTrigger>

					<Show
						when={currentStep() === 2}
						fallback={
							<Stepper.NextTrigger
								class={style.stepper__button__next}
								data-disabled={Boolean(errors()[currentStep()])}
							>
								Next
							</Stepper.NextTrigger>
						}
					>
						<button
							type="submit"
							class={style.stepper__button__submit}
							disabled={Boolean(errors().phone)}
						>
							Submit
						</button>
					</Show>
				</div>
			</form>
		</Stepper>
	);
};
