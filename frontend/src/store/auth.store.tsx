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

export const user_details = create((set) => ({
    name: '',
    dateOfBirth: '',
    phoneNo: '',
    email: '',
    address: '',
    housingType: '',
    occupation: '',
    pettingExperience: '',
    currentPets: 0,
    type: '',
    set: (key: string, value: any) => set({ [key]: value }),
}))