import { Text } from "@mantine/core";
import { format } from "date-fns";
import React, { FC } from "react";
import { ProductsItem } from "src/features/products/components/ProductsItem";
import { GetProduct } from "src/features/products/types";

type Props = {
  productList: GetProduct;
};

export const ProductList: FC<Props> = ({ productList }) => (
  <li className="border-0 border-b border-solid border-slate-200 py-4">
    <Text className="sticky top-0 bg-white">
      {format(new Date(productList.date), "yyyy年MM月dd日")}
    </Text>
    <ul className="mt-2 space-y-4">
      {productList.products.map((product) => (
        <ProductsItem product={product} key={product.id} />
      ))}
    </ul>
  </li>
);
