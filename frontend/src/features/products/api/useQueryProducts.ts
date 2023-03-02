import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "src/libs/axios";

const getProducts = async () => {
  const { data } = await axios.get<Product[]>("/products");

  return data;
};

export const useQueryProducts = (month: number = new Date().getMonth() + 1) =>
  useQuery<Product[], Error>({
    queryKey: ["products", month],
    queryFn: getProducts,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
