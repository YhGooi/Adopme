import { create } from 'zustand';

type AuthStore = {
    email: string;
    password: string;
    token: string;
    isLogin: boolean;
    user: string;
    set: (key: string, value: any) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
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
}));

type UserDetails = {
    id: string | number;
    name: string;
    dateOfBirth: string;
    phoneNo: string;
    email: string;
    address: string;
    housingType: string;
    occupation: string;
    pettingExperience: string;
    currentPets: number;
    type: string;
    set: (key: string, value: any) => void;
}

export const user_details = create<UserDetails>((set) => ({
    id: '',
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
}));