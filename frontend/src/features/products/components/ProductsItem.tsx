import { Badge, Checkbox, Text } from "@mantine/core";
import { Product } from "@prisma/client";
import React, { FC } from "react";

type Props = {
  product: Product;
};

export const ProductsItem: FC<Props> = ({ product }) => (
  <li className="border-0 border-b border-solid border-slate-200 py-4">
    <Text className="sticky top-0 bg-white">{product.boughtDay}</Text>
    <ul className="mt-2">
      <li className="flex justify-center space-x-4">
        <div className="flex flex-1">
          <div className="flex flex-[2] space-x-2">
            <Badge className="my-1 min-w-max">{product.boughtSite}</Badge>
            <div>{product.name}</div>
          </div>
          <div className="flex-1 text-right">{`${product.price}円`}</div>
        </div>
        <div className="flex justify-center space-x-4">
          <Checkbox checked={product.isPaid} />
          <Checkbox color="red" checked={product.deleted} />
        </div>
      </li>
    </ul>
  </li>
);
