import { useQuery } from "@tanstack/react-query";
import { GetProduct } from "src/features/products/types";
import axios from "src/libs/axios";

const getProducts = async () => {
  const { data } = await axios.get<GetProduct[]>("/products");

  return data;
};

export const useQueryProducts = (month: number = new Date().getMonth() + 1) =>
  useQuery<GetProduct[], Error>({
    queryKey: ["products", month],
    queryFn: getProducts,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
