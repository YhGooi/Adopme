// store/home.store.ts
import { create } from 'zustand';

type Pet = {
  name: string;
  age: string;
  image: string;
};

type HomeState = {
  pets: Pet[];
//   fetchPets: () => Promise<void>;
  fetchPets: () => void;
};

export const useHomeStore = create<HomeState>((set) => ({
  pets: [],
  fetchPets: () => {
    // Mock data to simulate API response
    const mockPets: Pet[] = [
      {
        name: 'Minnie',
        age: '3 years old',
        image: 'https://placekitten.com/200/200',
      },
      {
        name: 'Billy',
        age: '1.5 years old',
        image: 'https://placedog.net/400?id=1',
      },
      {
        name: 'Lucky',
        age: '1 year old',
        image: 'https://placekitten.com/201/201',
      },
      {
        name: 'Tiger',
        age: '2 years old',
        image: 'https://placedog.net/400?id=2',
      },
    ];

    // Simulate API call
    set({ pets: mockPets });
  },
//   fetchPets: async () => {
//     try {
//       const res = await fetch('http://localhost:8080/api/pets');
//       if (!res.ok) throw new Error(`Status ${res.status}`);
//       const data = await res.json();
//       set({ pets: data });
//     } catch (e) {
//       console.error('Failed to fetch pets:', e);
//       set({ pets: [] });
//     }
//   },
}));
