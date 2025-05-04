import { create } from 'zustand'

export const useStore = create((set) => ({
    bears: 0,
    increasePopulation: () => set((state: any) => ({ bears: Number(state.bears) + 1 })),
    removeAllBears: () => set({ bears: 0 }),
    updateBears: (newBears: Number) => set({ bears: newBears }),
}))