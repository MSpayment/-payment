import { Product } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DeleteProduct,
  InputProduct,
  UpdateChecked,
} from "src/features/products/types";
import axios from "src/libs/axios";

export const useMutateProduct = () => {
  const query = useQueryClient();
  const inputProductMutation = useMutation({
    mutationFn: async (input: InputProduct) => {
      const { data } = await axios.post<Product>("/products", input);

      return data;
    },
    onSuccess: (data) => {
      const { boughtDay } = data;
      const month = new Date(boughtDay).getMonth() + 1;
      query.invalidateQueries({ queryKey: ["products", month] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, product }: UpdateChecked) => {
      const { data } = await axios.patch<Product>(`/products/${id}`, product);

      return data;
    },
    onSuccess: (data) => {
      const { boughtDay } = data;
      const month = new Date(boughtDay).getMonth() + 1;
      query.invalidateQueries({ queryKey: ["products", month] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async ({ id }: DeleteProduct) => {
      const { data } = await axios.delete<Product>(`/products/${id}`);

      return data;
    },
    onSuccess: (data) => {
      const { boughtDay } = data;
      const month = new Date(boughtDay).getMonth() + 1;
      query.invalidateQueries({ queryKey: ["products", month] });
    },
  });

  return {
    inputProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
};
