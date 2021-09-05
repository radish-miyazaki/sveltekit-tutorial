<script>
	import {fade} from "svelte/transition";
</script>

<style>
	span {
		display: inline-block;
		margin: 0 0.5rem;
		border-radius: 10px;
		border: 1px solid #1ac745;
		background: white;
		color: #1ac745;
		padding: 0.125rem 0.5rem;
		font-family: 'Lato', sans-serif;
		font-size: 0.25rem;
	}
</style>

<span transition:fade>
	<slot />
</span>