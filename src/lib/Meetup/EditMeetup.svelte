<script lang="ts">
	import customMeetupsStore from '../../meetups-store';
	import {createEventDispatcher} from "svelte";
	import TextInput from "../UI/TextInput.svelte";
	import Button from "../UI/Button.svelte";
	import Modal from "../UI/Modal.svelte";
	import {isEmpty, isValidEmail} from "../../helpers/validation";
	import type {Meetup} from "../../models/types";
	import { FIREBASE_URI } from '$lib/Env';

	export let id: string = null;

	let title = '';
	let subtitle  = '';
	let address = '';
	let email = '';
	let description = '';
	let imageUrl = '';

	// 編集時には値をStoreから取得
	if (id) {
		const unsubscribe = customMeetupsStore.subscribe(items => {
			const selectedMeetup = items.find(i => i.id === id);
			title = selectedMeetup.title
			subtitle = selectedMeetup.subtitle
			address = selectedMeetup.address
			email = selectedMeetup.contactEmail
			description = selectedMeetup.description
			imageUrl = selectedMeetup.imageUrl
		});

		unsubscribe();
	}

	// validation computed values
	$: titleValid = !isEmpty(title);
	$: subtitleValid = !isEmpty(subtitle);
	$: addressValid = !isEmpty(address);
	$: emailValid = isValidEmail(email);
	$: descriptionValid = !isEmpty(description);
	$: imageUrlValid = !isEmpty(imageUrl);
	// 全validationを管理する値
	$: formIsValid = titleValid &&
		subtitleValid &&
		addressValid &&
		emailValid &&
		descriptionValid &&
		imageUrlValid

	const dispatch = createEventDispatcher();

	const handleClickSave = async () => {
		const meetupData: Meetup = {
			title,
			subtitle,
			address,
			description,
			imageUrl,
			contactEmail: email,
		};

		if (id) {
			// 更新
			fetch(FIREBASE_URI + `/${id}.json`, {
				method: "PATCH",
				body: JSON.stringify(meetupData),
				headers: {
					"Content-Type": "application/json",
				}
			})
				.then(res => {
					if (!res.ok) {
						throw new Error("An error occurred, please try again!");
					}
					customMeetupsStore.updateMeetup(id, meetupData)
				})
				.catch(err => console.log(err))
		} else {
			// 追加
			await fetch(FIREBASE_URI + ".json", {
				method: "POST",
				body: JSON.stringify({...meetupData, isFavorite: false}),
				headers: {
					"Content-Type": "application/json",
				}
			})
				.then(res => {
					if (!res.ok) {
						throw new Error("An error occurred, please try again!");
					}
					return res.json();
				})
				.then(data => {
					customMeetupsStore.addMeetup({...meetupData, isFavorite: false, id: data.name});
				})
				.catch(err => console.log(err));
		}

		dispatch('save')
	}

	const deleteMeetup = () => {
		fetch(FIREBASE_URI + `/${id}.json`, {
			method: "DELETE",
		})
			.then(res => {
				if (!res.ok) {
					throw new Error("An error occurred, please try again!");
				}
				customMeetupsStore.removeMeetup(id);
			})
			.catch(err => console.log(err))
		dispatch('save');
	}

	const cancel = () => dispatch('cancel');
</script>

<style>
	.form {
		width: 100%;
	}
</style>

<Modal title="Edit Meetup Data" on:cancel>
	<div class="form">
		<TextInput
			id="title"
			label="Title"
			valid={titleValid}
			validityMessage="Please enter a valid title."
			value={title}
			on:input={(e) => title = e.target.value}
		/>
		<TextInput
			id="subtitle"
			label="Subtitle"
			valid={subtitleValid}
			validityMessage="Please enter a valid subtitle."
			value={subtitle}
			on:input={(e) => subtitle = e.target.value}
		/>
		<TextInput
			id="address"
			label="Address"
			valid={addressValid}
			validityMessage="Please enter a valid address."
			value={address}
			on:input={(e) => address = e.target.value}
		/>
		<TextInput
			id="imageUrl"
			label="Image URL"
			valid={imageUrlValid}
			validityMessage="Please enter a valid url."
			value={imageUrl}
			on:input={(e) => imageUrl = e.target.value}
		/>
		<TextInput
			id="email"
			type="email"
			label="Email"
			valid={emailValid}
			validityMessage="Please enter a valid email."
			value={email}
			on:input={(e) => email = e.target.value}
		/>
		<TextInput
			controlType="textarea"
			rows="3"
			id="description"
			label="Description"
			valid={descriptionValid}
			validityMessage="Please enter a valid description."
			bind:value={description}
		/>
	</div>

	<div slot="footer">
		<Button mode="outline" on:click={cancel}>Cancel</Button>
		<Button on:click={handleClickSave} disabled={!formIsValid}>Save</Button>
		{#if id}
			<Button on:click={deleteMeetup}>Delete</Button>
		{/if}
	</div>
</Modal>