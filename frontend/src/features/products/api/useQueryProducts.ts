import { useQuery } from "@tanstack/react-query";
import { GetProduct } from "src/features/products/types";
import axios from "src/libs/axios";

type Args = {
  month: number;
  year: number;
};

const getProducts = async ({ month, year }: Args) => {
  const url = `/products/${year}/${month}`;
  const { data } = await axios.get<GetProduct[]>(url);

  return data;
};

export const useQueryProducts = (
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear()
) =>
  useQuery<GetProduct[], Error>({
    queryKey: ["products", year, month],
    queryFn: () => getProducts({ month, year }),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
