<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { FIREBASE_URI } from '$lib/Env';

	export const load: Load = async ({page, fetch}) => {
		const meetupId = page.params.id;

		const res = await fetch(FIREBASE_URI + `/${meetupId}.json`)
		if (res.ok) {
			const data = await res.json();
			return {
				props: {
					selectedMeetup: {...data, id: meetupId}
				}
			}
		}

		return {
			status: 404,
			error: new Error(`Could not fetch meetups!`)
		};
	}
</script>

<script lang="ts">
	import Button from '$lib/UI/Button.svelte';

	export let selectedMeetup;
</script>

<style>
	section {
		margin-top: 4rem;
	}

	.image {
		width: 100%;
		height: 25rem;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image {
		background: #e7e7e7;
	}

	.content {
		text-align: center;
		width: 80%;
		margin: auto;
	}

	h1 {
		font-size: 2rem;
		font-family: 'Roboto Slab', sans-serif;
		margin: 0.5rem 0;
	}

	h2 {
		font-size: 1.25rem;
		color: #6b6b6b;
	}

	p {
		font-size: 1.5rem;
	}
</style>

<svelte:head>
	<title>{selectedMeetup.title}</title>
</svelte:head>

<section>
	<div class="image">
		<img src="{selectedMeetup.imageUrl}" alt="">
	</div>
	<div class="content">
		<h1>{selectedMeetup.title}</h1>
		<h2>{selectedMeetup.subtitle} - {selectedMeetup.address}</h2>
		<p>{selectedMeetup.description}</p>
		<Button href="mailto:{selectedMeetup.contactEmail}">Contact</Button>
		<Button href='/' mode="outline">Close</Button>
	</div>
</section>