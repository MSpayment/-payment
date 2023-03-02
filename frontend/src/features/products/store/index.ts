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
