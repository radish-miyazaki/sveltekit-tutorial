<script context="module" lang="ts">
	export const load = ({ error, status }) => {
		return {
			props: {
				status,
				error,
			}
		};
	}
</script>

<script>
	export let status;
	export let error;
</script>

<h1>{status}</h1>
<p>{error.message}</p>