import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "src/libs/axios";

const getProducts = async () => {
  const { data } = await axios.get<Product[]>("/products");

  return data;
};

export const useQueryProducts = () =>
  useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: getProducts,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
