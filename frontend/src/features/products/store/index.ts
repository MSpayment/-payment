import { create } from "zustand";
import { InputProduct } from "src/features/products/types";

type InputProductStore = {
  inputProduct: InputProduct;
  setInputProduct: (input: InputProduct) => void;
};

export const useInputProductState = create<InputProductStore>((set) => ({
  inputProduct: {
    price: 0,
    name: "",
    boughtSite: "",
    boughtDay: new Date(),
  },

  setInputProduct: (inputProduct: InputProduct) => {
    set({ inputProduct });
  },
}));

type SelectDateStore = {
  date: {
    year: number;
    month: number;
  };

  setSelectDate: (date: { year: number; month: number }) => void;
  increaseMonth: () => void;
  decreaseMonth: () => void;
};

export const useSelectDateState = create<SelectDateStore>((set) => ({
  date: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  },

  setSelectDate: (date: { year: number; month: number }) => {
    set({ date });
  },

  increaseMonth: () => {
    set((state) => ({
      date: {
        year: state.date.month === 12 ? state.date.year + 1 : state.date.year,
        month: state.date.month === 12 ? 1 : state.date.month + 1,
      },
    }));
  },

  decreaseMonth: () => {
    set((state) => ({
      date: {
        year: state.date.month === 1 ? state.date.year - 1 : state.date.year,
        month: state.date.month === 1 ? 12 : state.date.month - 1,
      },
    }));
  },
}));
