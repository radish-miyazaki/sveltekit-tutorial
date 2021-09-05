<script context="module" lang="ts">
	// Prefetch data
	import type { Load } from '@sveltejs/kit';
	import { FIREBASE_URI } from '$lib/Env';

	export const load: Load = async ({ fetch }) => {
		const res = await fetch(FIREBASE_URI + '.json')
		const loadedMeetups = [];
		if (res.ok) {
			const data = await res.json();

			for (const key in data) {
				loadedMeetups.push({
					...data[key],
					id: key,
				})
			}

			return {
				props: {
					meetups: loadedMeetups.reverse()
				}
			}
		}

		return {
			status: 500,
			error: new Error(`Could not fetch meetups!`)
		};
	}
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { flip } from "svelte/animate";
	import { scale } from "svelte/transition";
	import EditMeetup from '$lib/Meetup/EditMeetup.svelte';
	import LoadingSpinner from '$lib/UI/LoadingSpinner.svelte';
	import MeetupFilter from '$lib/Meetup/MeetupFilter.svelte';
	import Button from '$lib/UI/Button.svelte';
	import MeetupItem from '$lib/Meetup/MeetupItem.svelte';
	import customMeetupsStore from '../meetups-store';

	export let meetups;

	let unsubscribe;
	let editMode: string;
	let editedId: string;
	let isLoading = false;
	let favsOnly = false;

	$: filteredMeetups = favsOnly ? meetups.filter(m => m.isFavorite) : meetups;

	onMount(() => {
		customMeetupsStore.setMeetups(meetups);
		unsubscribe = customMeetupsStore.subscribe(items => {
			meetups = items;
		})
	})

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	})

	const setFilter = (e) => {
		favsOnly = e.detail === 1;
	}

	const savedMeetup = () => {
		editMode = null;
		editedId = null;
	}

	const cancelEdit = () => {
		editMode = null;
		editedId = null;
	}

	const startEdit = (e) => {
		editMode = "edit";
		editedId = e.detail;
	}

	const startAdd = () => {
		editMode = "edit";
	}
</script>

<style>
	section {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 1rem;
		margin-top: 1rem;
	}

	#meetup-controls {
		margin: 1rem;
		display: flex;
		justify-content: space-between;
	}

	#no-meetups {
		padding: 1rem;
	}

	@media (min-width: 768px) {
		#meetups {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>

<svelte:head>
	<title>All Meetups</title>
</svelte:head>

{#if editMode === 'edit'}
	<EditMeetup on:save={savedMeetup} on:cancel={cancelEdit} id={editedId} />
{/if}

{#if isLoading}
	<LoadingSpinner />
{:else}
	<section id="meetup-controls">
		<MeetupFilter on:select={setFilter} />
		<Button on:click={startAdd}>New Meetup</Button>
	</section>

	{#if filteredMeetups.length === 0}
		<p id="no-meetups">No meetups found, you can start adding some.</p>
	{/if}

	<section id="meetups">
		{#each filteredMeetups as meetup (meetup.id)}
			<div transition:scale animate:flip={{duration: 300}}>
				<MeetupItem
					id={meetup.id}
					title={meetup.title}
					subtitle={meetup.subtitle}
					description={meetup.description}
					imageUrl={meetup.imageUrl}
					email={meetup.contactEmail}
					address={meetup.address}
					isFavorite={meetup.isFavorite}
					on:edit={startEdit}
				/>
			</div>
		{/each}
	</section>
{/if}
