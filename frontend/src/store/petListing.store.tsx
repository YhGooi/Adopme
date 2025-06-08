// store/petListing.store.ts
import { create } from 'zustand';

export type Pet = {
  id: number;
  name: string;
  age: number;
  dob: string;
  gender: string;
  species: string;
  breed: string;
  weight: number;
  vaccinated: boolean;
  description: string;
  petImageUrl: string;
};

type PetListingState = {
  pets: Pet[];
  fetchPets: () => Promise<void>;
};

export const usePetListingStore = create<PetListingState>((set) => ({
  pets: [],
  fetchPets: async () => {
    try {
      const res = await fetch('http://localhost:8080/pet/active');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      set({ pets: data });
    } catch (e) {
      console.error('Failed to fetch pets:', e);
      set({ pets: [] });
    }
  },
}));