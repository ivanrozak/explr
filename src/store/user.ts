// import { UserSessionData } from "@/db/libs/global";
import { User } from "@prisma/client";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const userStore = create<UserStore>((set) => ({
  user: null,
  setUser: (newUser) => set({ user: newUser }),
}));
