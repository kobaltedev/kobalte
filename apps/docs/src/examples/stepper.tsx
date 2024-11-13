import { Stepper } from "@kobalte/core/stepper"
import { createSignal } from "solid-js";
import styles from "./stepper.module.css";

export const BasicExample = () => {
	return (
		<Stepper
			class={styles.stepper__root}
			maxSteps={3}
		>
			<Stepper.List class={styles.stepper__list}>
				<Stepper.Item class={styles.stepper__item} index={0}>
					<div class={styles.stepper__trigger}>1</div>
					<span class={styles.stepper__label}>Step 1</span>
				</Stepper.Item>
				<Stepper.Separator class={styles.stepper__separator} />
				<Stepper.Item class={styles.stepper__item} index={1}>
					<div class={styles.stepper__trigger}>2</div>
					<span class={styles.stepper__label}>Step 2</span>
				</Stepper.Item>
				<Stepper.Separator class={styles.stepper__separator} />
				<Stepper.Item class={styles.stepper__item} index={2}>
					<div class={styles.stepper__trigger}>3</div>
					<span class={styles.stepper__label}>Step 3</span>
				</Stepper.Item>
			</Stepper.List>

			<Stepper.Content class={styles.stepper__content} index={0}>
				<h2 class={styles.stepper__title}>Step 1 Content</h2>
				<p>This is the content for step 1</p>
			</Stepper.Content>

			<Stepper.Content class={styles.stepper__content} index={1}>
				<h2 class={styles.stepper__title}>Step 2 Content</h2>
				<p>This is the content for step 2</p>
			</Stepper.Content>

			<Stepper.Content class={styles.stepper__content} index={2}>
				<h2 class={styles.stepper__title}>Step 3 Content</h2>
				<p>This is the content for step 3</p>
			</Stepper.Content>

			<Stepper.CompletedContent class={styles.stepper__completed}>
				<h2>All steps completed!</h2>
				<p>Thank you for completing all steps.</p>
				<Stepper.Trigger
					class={styles.stepper__button}
					step={0}
				>
					Start Over
				</Stepper.Trigger>
			</Stepper.CompletedContent>

			<div class={styles.stepper__actions}>
				<Stepper.PrevTrigger class={styles.stepper__button}>
					Previous
				</Stepper.PrevTrigger>
				<Stepper.NextTrigger class={styles.stepper__button__next}>
					Next
				</Stepper.NextTrigger>
			</div>
		</Stepper>
	);
}

export const FormExample = () => {
	const [currentStep, setCurrentStep] = createSignal(0);
	const [formData, setFormData] = createSignal({
		personalInfo: { name: "", email: "" },
		address: { street: "", city: "" },
		review: false
	});

	return (
		<Stepper
			class={styles.stepper__root}
			maxSteps={3}
			step={currentStep()}
			onStepChange={setCurrentStep}
		>
			<Stepper.List class={styles.stepper__list}>
				<Stepper.Item class={styles.stepper__item} index={0}>
					<div class={styles.stepper__trigger}>1</div>
					<span class={styles.stepper__label}>Personal Info</span>
				</Stepper.Item>
				<Stepper.Separator class={styles.stepper__separator} />
				<Stepper.Item class={styles.stepper__item} index={1}>
					<div class={styles.stepper__trigger}>2</div>
					<span class={styles.stepper__label}>Address</span>
				</Stepper.Item>
				<Stepper.Separator class={styles.stepper__separator} />
				<Stepper.Item class={styles.stepper__item} index={2}>
					<div class={styles.stepper__trigger}>3</div>
					<span class={styles.stepper__label}>Review</span>
				</Stepper.Item>
			</Stepper.List>

			<Stepper.Content class={styles.stepper__content} index={0}>
				<h2 class={styles.stepper__title}>Personal Information</h2>
				<div class={styles.stepper__inputContainer}>
					<input
						class={styles.stepper__input}
						type="text"
						placeholder="Name"
						value={formData().personalInfo.name}
						onInput={(e) => setFormData({
							...formData(),
							personalInfo: { ...formData().personalInfo, name: e.currentTarget.value }
						})}
					/>
				</div>
				<div class={styles.stepper__inputContainer}>
					<input
						class={styles.stepper__input}
						type="email"
						placeholder="Email"
						value={formData().personalInfo.email}
						onInput={(e) => setFormData({
							...formData(),
							personalInfo: { ...formData().personalInfo, email: e.currentTarget.value }
						})}
					/>
				</div>
			</Stepper.Content>

			<Stepper.Content class={styles.stepper__content} index={1}>
				<h2 class={styles.stepper__title}>Address</h2>
				<div class={styles.stepper__inputContainer}>
					<input
						class={styles.stepper__input}
						type="text"
						placeholder="Street"
						value={formData().address.street}
						onInput={(e) => setFormData({
							...formData(),
							address: { ...formData().address, street: e.currentTarget.value }
						})}
					/>
				</div>
				<div class={styles.stepper__inputContainer}>
					<input
						class={styles.stepper__input}
						type="text"
						placeholder="City"
						value={formData().address.city}
						onInput={(e) => setFormData({
							...formData(),
							address: { ...formData().address, city: e.currentTarget.value }
						})}
					/>
				</div>
			</Stepper.Content>

			<Stepper.Content class={styles.stepper__content} index={2}>
				<h2 class={styles.stepper__title}>Review</h2>
				<div class={styles.stepper__review}>
					<div class={styles.stepper__summary}>
						<p>Name: {formData().personalInfo.name}</p>
						<p>Email: {formData().personalInfo.email}</p>
						<p>Street: {formData().address.street}</p>
						<p>City: {formData().address.city}</p>
					</div>
				</div>
			</Stepper.Content>

			<div class={styles.stepper__actions}>
				<Stepper.PrevTrigger class={styles.stepper__button}>
					Previous
				</Stepper.PrevTrigger>
				<Stepper.NextTrigger class={styles.stepper__button__next}>
					Next
				</Stepper.NextTrigger>
			</div>

			<Stepper.CompletedContent class={styles.stepper__completed}>
				<h2>All steps completed!</h2>
				<p>Thank you for submitting your information.</p>
			</Stepper.CompletedContent>
		</Stepper>
	);
}

export const ValidatedExample = () => {
	const [currentStep, setCurrentStep] = createSignal(0);
	const [errors, setErrors] = createSignal({});
	const [formData, setFormData] = createSignal({
		username: "",
		email: "",
		password: ""
	});

	const validateStep = (step: number) => {
		const newErrors: Record<string, string> = {};

		if (step === 0) {
			if (!formData().username) {
				newErrors.username = "Username is required";
			} else if (formData().username.length < 3) {
				newErrors.username = "Username must be at least 3 characters";
			}
		}

		if (step === 1) {
			if (!formData().email) {
				newErrors.email = "Email is required";
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData().email)) {
				newErrors.email = "Invalid email format";
			}
		}

		if (step === 2) {
			if (!formData().password) {
				newErrors.password = "Password is required";
			} else if (formData().password.length < 6) {
				newErrors.password = "Password must be at least 6 characters";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleStepChange = (newStep: number) => {
		if (validateStep(currentStep())) {
			setCurrentStep(newStep);
		}
	};

	return (
		<Stepper
			class={styles.stepper__root}
			maxSteps={3}
			step={currentStep()}
			onStepChange={handleStepChange}
		>
			<Stepper.List class={styles.stepper__list}>
				<Stepper.Item class={styles.stepper__item} index={0}>
					<div class={styles.stepper__trigger}>1</div>
					<span class={styles.stepper__label}>Username</span>
				</Stepper.Item>
				<Stepper.Separator class={styles.stepper__separator} />
				<Stepper.Item class={styles.stepper__item} index={1}>
					<div class={styles.stepper__trigger}>2</div>
					<span class={styles.stepper__label}>Email</span>
				</Stepper.Item>
				<Stepper.Separator class={styles.stepper__separator} />
				<Stepper.Item class={styles.stepper__item} index={2}>
					<div class={styles.stepper__trigger}>3</div>
					<span class={styles.stepper__label}>Password</span>
				</Stepper.Item>
			</Stepper.List>

			<Stepper.Content class={styles.stepper__content} index={0}>
				<h2 class={styles.stepper__title}>Choose Username</h2>
				<div class={styles.stepper__inputContainer}>
					<input
						class={`${styles.stepper__input} ${errors().username ? styles.input__error : ''}`}
						type="text"
						placeholder="Username"
						value={formData().username}
						onInput={(e) => setFormData({ ...formData(), username: e.currentTarget.value })}
					/>
					{errors().username && <div class={styles.error}>{errors().username}</div>}
				</div>
			</Stepper.Content>

			<Stepper.Content class={styles.stepper__content} index={1}>
				<h2 class={styles.stepper__title}>Enter Email</h2>
				<div class={styles.stepper__inputContainer}>
					<input
						class={`${styles.stepper__input} ${errors().email ? styles.input__error : ''}`}
						type="email"
						placeholder="Email"
						value={formData().email}
						onInput={(e) => setFormData({ ...formData(), email: e.currentTarget.value })}
					/>
					{errors().email && <div class={styles.error}>{errors().email}</div>}
				</div>
			</Stepper.Content>

			<Stepper.Content class={styles.stepper__content} index={2}>
				<h2 class={styles.stepper__title}>Create Password</h2>
				<div class={styles.stepper__inputContainer}>
					<input
						class={`${styles.stepper__input} ${errors().password ? styles.input__error : ''}`}
						type="password"
						placeholder="Password"
						value={formData().password}
						onInput={(e) => setFormData({ ...formData(), password: e.currentTarget.value })}
					/>
					{errors().password && <div class={styles.error}>{errors().password}</div>}
				</div>
			</Stepper.Content>

			<div class={styles.stepper__actions}>
				<Stepper.PrevTrigger class={styles.stepper__button}>
					Previous
				</Stepper.PrevTrigger>
				<Stepper.NextTrigger class={styles.stepper__button__next}>
					Next
				</Stepper.NextTrigger>
			</div>
		</Stepper>
	);
}
export default function App() {
	return (
		<>
			<BasicExample />
			<FormExample />
			<ValidatedExample />
		</>
	);
}
