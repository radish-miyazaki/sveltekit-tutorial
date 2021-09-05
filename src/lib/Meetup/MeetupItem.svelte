<script lang="ts">
	import Button from "../UI/Button.svelte";
	import Badge from "../UI/Badge.svelte";
	import customMeetupsStore from '../../meetups-store';
	import {createEventDispatcher} from "svelte";
	import { FIREBASE_URI } from '$lib/Env';
	// import LoadingSpinner from "../UI/LoadingSpinner.svelte";

	export let id: string;
	export let title: string;
	export let subtitle: string;
	export let imageUrl: string;
	export let description: string;
	export let address: string;
	export let email: string;
	export let isFavorite: boolean;

	let isLoading = false;

	const dispatch = createEventDispatcher();

	const toggleFavorite = () => {
		isLoading = true;
		fetch(FIREBASE_URI + `/${id}.json`, {
			method: "PATCH",
			body: JSON.stringify({isFavorite: !isFavorite}),
			headers: {
				"Content-Type": "application/json",
			}
		})
			.then(res => {
				if (!res.ok) {
					throw new Error("An error occurred, please try again!");
				}
				isLoading = false;
				customMeetupsStore.toggleFavorite(id);
			})
			.catch(err => {
				isLoading = false;
				console.log(err)
			})
	}
</script>

<style>
	article {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
		border-radius: 5px;
		background: white;
		margin: 1rem;
	}

	header,
	.content,
	footer {
		padding: 1rem;
	}

	.image {
		width: 100%;
		height: 14rem;
	}

	.image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	h1 {
		font-size: 1.25rem;
		margin: 0.5rem 0;
		font-family: "Roboto Slab", serif;
	}

	h2 {
		font-size: 1rem;
		color: #808080;
		margin: 0.5rem 0;
	}

	p {
		font-size: 1.25rem;
		margin: 0;
	}

	div {
		text-align: right;
	}

	.content {
		height: 4rem;
	}
</style>

<article>
	<header>
		<h1>
			{title}
			{#if isFavorite}
				<Badge>FAVORITE</Badge>
			{/if}
		</h1>
		<h2>{subtitle}</h2>
		<p>{address}</p>
	</header>
	<div class="image">
		<img src="{imageUrl}" alt="{title}" />
	</div>
	<div class="content">
		<p>{description}</p>
	</div>
	<footer>
		<Button mode="outline" type="button" on:click={() => dispatch('edit', id)}>Edit</Button>
		{#if isLoading}
			<!--      <LoadingSpinner />-->
			<span style="margin: 0 1rem">Changing...</span>
		{:else}
			<Button
				mode="outline"
				type="button"
				color={isFavorite ? null : 'success'}
				on:click={toggleFavorite}
			>
				{isFavorite ? 'Unfavorite': 'Favorite'}
			</Button>
		{/if}
		<Button href='/{id}'>
			Show Details
		</Button>
	</footer>
</article>