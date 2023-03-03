import { Badge, Checkbox, Text } from "@mantine/core";
import { Product } from "@prisma/client";
import React, { FC } from "react";
import { format } from "date-fns";
import { useMutateProduct } from "src/features/products/api/useMutateProduct";

type Props = {
  product: Product;
};

export const ProductsItem: FC<Props> = ({ product }) => {
  const { updateProductMutation } = useMutateProduct();

  const handleIsPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProductMutation.mutate({
      id: product.id,
      product: {
        isPaid: e.target.checked,
        name: product.name,
        price: product.price,
        boughtDay: product.boughtDay,
        boughtSite: product.boughtSite,
      },
    });
  };

  return (
    <li className="border-0 border-b border-solid border-slate-200 py-4">
      <Text className="sticky top-0 bg-white">
        {format(new Date(product.boughtDay), "yyyy年MM月dd日")}
      </Text>
      <ul className="mt-2">
        <li className="flex justify-center space-x-4">
          <div className="flex flex-1">
            <div className="flex flex-[2] space-x-2">
              <Badge
                color={product.boughtSite === "メルカリ" ? "red" : "blue"}
                className="my-1 min-w-max"
              >
                {product.boughtSite}
              </Badge>
              <div>{product.name}</div>
            </div>
            <div className="flex-1 text-right">{`${product.price}円`}</div>
          </div>
          <div className="flex justify-center space-x-4">
            <Checkbox onChange={handleIsPaidChange} checked={product.isPaid} />
            <Checkbox
              onChange={() => console.log("a")}
              color="red"
              checked={product.deleted}
            />
          </div>
        </li>
      </ul>
    </li>
  );
};
