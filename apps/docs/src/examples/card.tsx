import { Card } from "@kobalte/core/card";

import style from "./card.module.css";

export function BasicExample() {
	return (
		<Card class={style.card}>
			<Card.Header>
				<Card.Title class={style.card__title}>Security</Card.Title>
				<Card.Description class={style.card__description}>
					Security insights and blocked logins
				</Card.Description>
			</Card.Header>
			<Card.Content class={style.card__content}>
				<p>Security insights: 40 (12 high, 28 low)</p>
				<p>Logins blocked: 0</p>
			</Card.Content>
		</Card>
	);
}

export function WithHeaderActionExample() {
	return (
		<Card class={style.card}>
			<Card.Header class={style["card__header-with-action"]}>
				<Card.Title class={style.card__title}>Workers and Pages</Card.Title>
				<Card.HeaderAction>
					<button type="button" class={style["icon-button"]} aria-label="Add">
						+
					</button>
				</Card.HeaderAction>
			</Card.Header>
			<Card.Content class={style.card__content}>
				8 deployed services
			</Card.Content>
		</Card>
	);
}

export function ListContentExample() {
	const domains = [
		{ name: "solidjs.com", visits: "140K" },
		{ name: "solid-movies.app", visits: "39K" },
		{ name: "solidjs.community", visits: "10K" },
	];

	return (
		<Card class={style.card}>
			<Card.Header>
				<Card.Title class={style.card__title}>Domains</Card.Title>
			</Card.Header>
			<Card.Content>
				<ul class={style.list}>
					{domains.map((domain) => (
						<li class={style.list__item}>
							<span>{domain.name}</span>
							<span class={style.list__meta}>{domain.visits}</span>
						</li>
					))}
				</ul>
			</Card.Content>
		</Card>
	);
}

export function DashboardGridExample() {
	return (
		<div class={style.grid}>
			<Card class={style.card}>
				<Card.Header>
					<Card.Title class={style.card__title}>Security</Card.Title>
				</Card.Header>
				<Card.Content class={style.card__stat}>40</Card.Content>
			</Card>
			<Card class={style.card}>
				<Card.Header>
					<Card.Title class={style.card__title}>Performance</Card.Title>
				</Card.Header>
				<Card.Content class={style.card__stat}>16.2%</Card.Content>
			</Card>
			<Card class={`${style.card} ${style["grid__tall-card"]}`}>
				<Card.Header>
					<Card.Title class={style.card__title}>Zero Trust security</Card.Title>
				</Card.Header>
				<Card.Content>
					<ul class={style.list}>
						<li class={style.list__item}>Used / total seats — 0/50</li>
						<li class={style.list__item}>Access controls — 0</li>
						<li class={style.list__item}>DNS policies — 0</li>
					</ul>
				</Card.Content>
			</Card>
			<Card class={`${style.card} ${style["grid__wide-card"]}`}>
				<Card.Header>
					<Card.Title class={style.card__title}>Audit logs</Card.Title>
				</Card.Header>
				<Card.Content class={style.card__content}>
					Update project · Delete deployment · Delete deployment
				</Card.Content>
			</Card>
		</div>
	);
}
