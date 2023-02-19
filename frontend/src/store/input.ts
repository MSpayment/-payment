import { create } from "zustand";

type AuthInputState = {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
};

export const useAuthInput = create<AuthInputState>((set) => ({
  email: "",
  password: "",
  setEmail: (email: string) => set({ email }),
  setPassword: (password: string) => set({ password }),
}));
