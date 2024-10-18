import { Board, Category, Pin } from "@prisma/client";
import { create } from "zustand";
import { PinExtended } from "../../types";

interface PinStore {
  pinData: PinExtended[] | [];
  boardData: Board[] | [];
  categories: Category[] | [];
  setPinData: (pinData: PinExtended[] | []) => void;
  setBoardData: (boardData: Board[] | []) => void;
  setCategories: (categories: Category[] | []) => void;
}

export const pinStore = create<PinStore>((set) => ({
  pinData: [],
  boardData: [],
  categories: [],
  setPinData: (newPinData) => set({ pinData: newPinData }),
  setBoardData: (newBoardData) => set({ boardData: newBoardData }),
  setCategories: (newCategories) => set({ categories: newCategories }),
}));
