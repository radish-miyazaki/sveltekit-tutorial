import {writable} from "svelte/store";
import type {Meetup} from './models/types';

const meetups = writable<Meetup[]>([])

const customMeetupsStore = {
  // Read
  subscribe: meetups.subscribe,
  // Add
  addMeetup: (meetupData: Meetup) => {
    const newMeetup = {
      ...meetupData,
    };
    meetups.update((items) => {
      return [newMeetup, ...items]
    })
  },
  // Update
  updateMeetup: (id, meetupData) => {
    meetups.update((items) => {
      const meetupIndex = items.findIndex(m => m.id === id);
      const updatedMeetup = { ...items[meetupIndex], ...meetupData };
      const updatedMeetups = [...items];

      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    })
  },
  // Delete
  removeMeetup: (id) => {
    meetups.update((items) => {
      return items.filter(i => i.id !== id);
    })
  },
  // Setter
  setMeetups: (meetupArray) => {
    meetups.set(meetupArray);
  },
  toggleFavorite: (id) => {
    meetups.update((items) => {
      const updatedMeetup: Meetup = { ...items.find(m => m.id === id) };
      updatedMeetup.isFavorite = !updatedMeetup.isFavorite;

      const meetupIndex = items.findIndex(m => m.id === id);
      const updatedMeetups: Meetup[] = [...items];

      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    })
  },
}

export default customMeetupsStore;