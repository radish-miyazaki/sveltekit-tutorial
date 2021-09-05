<script lang="ts">
	import Header from '$lib/UI/Header.svelte';
</script>

<main>
	<slot />
</main>

<Header />


<style>
	main {
		margin-top: 5rem;
	}
</style>
