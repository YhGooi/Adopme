import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    email: "",
    password: "",
    token: "",
    isLogin: false,
    user: "",
    set: (key: string, value: any) => set({ [key]: value }),
    logout: () =>
        set({
            token: "",
            isLogin: false,
        }),
}))