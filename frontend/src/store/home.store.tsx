// store/home.store.ts
import { create } from 'zustand';

export type Pet = {
  id: number;
  name: string;
  age: string;
  dob: string;
  gender: string;
  species: string;
  breed: string;
  weight: number;
  vaccinated: boolean;
  description: string;
  petImageUrl: string;
};

type HomeState = {
  pets: Pet[];
  fetchPets: () => Promise<void>;
};

export const useHomeStore = create<HomeState>((set) => ({
  pets: [],
  fetchPets: async () => {
    try {
      const res = await fetch('http://localhost:8080/pets/active');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();

      const formattedPets = data.map((pet: any) => ({
        id: pet.id,
        name: pet.name,
        age: `${pet.age} years old`,
        dob: pet.dob,
        gender: pet.gender,
        species: pet.species,
        breed: pet.breed,
        weight: pet.weight,
        vaccinated: pet.vaccinated,
        description: pet.description,
        petImageUrl: pet.petImageUrl,
      }));

      set({ pets: formattedPets });
    } catch (e) {
      console.error('Failed to fetch pets:', e);
      set({ pets: [] });
    }
  },
}));