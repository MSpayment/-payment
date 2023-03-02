import { Product } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InputProduct } from "src/features/products/types";
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
      const prevData = query.getQueryData<Product[]>(["products", month]);
      if (prevData) {
        query.setQueryData(["products", month], [...prevData, data]);
      }
    },
  });

  return {
    inputProductMutation,
  };
};
