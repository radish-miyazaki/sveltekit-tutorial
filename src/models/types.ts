export interface Meetup {
  id?: string;
  title: string;
  subtitle: string;
  address: string;
  description: string;
  imageUrl: string;
  contactEmail: string;
  isFavorite?: boolean;
}