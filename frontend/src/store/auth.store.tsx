import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    email: "",
    password: "",
    isLogin: false,
    set: (key: string, value: any) => set({ [key]: value }),
    logout: ((state: any) => state.isLogin = false)
}))