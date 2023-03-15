import { Badge, Checkbox, Loader, Text } from "@mantine/core";
import { Product } from "@prisma/client";
import React, { FC } from "react";
import { useMutateProduct } from "src/features/products/api/useMutateProduct";

type Props = {
  product: Product;
};

export const ProductsItem: FC<Props> = ({ product }) => {
  const { updateProductMutation, deleteProductMutation } = useMutateProduct();

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

  const deleteProductHandler = async () => {
    await deleteProductMutation.mutateAsync({
      id: product.id,
      boughtDay: product.boughtDay,
    });
  };

  return (
    <li className="flex w-full flex-col">
      <div style={product.isPaid ? { color: "#ccc" } : { color: "#222" }}>
        <Badge
          size="xs"
          className="mb-3 max-w-max"
          // color= {product.isPaid ? "gray" : (product.boughtSite === "メルカリ" ? "red" : "blue")}
          color={(() => {
            if (product.isPaid) return "gray.4";
            if (product.boughtSite === "メルカリ") {
              return "red";
            }

            return "blue";
          })()}
        >
          {product.boughtSite}
        </Badge>
        <div className="flex gap-2">
          <Text
            component="p"
            className="flex-1 overflow-hidden break-words text-sm"
            color={product.boughtSite ? "black" : "blue"}
            style={product.isPaid ? { color: "#d0d0d0" } : { color: "#222" }}
          >
            {product.name}
          </Text>
          <Text component="p" className="w-24 text-right text-sm">
            {product.price.toLocaleString()}円
          </Text>
          <div className="flex justify-center space-x-2">
            {updateProductMutation.isLoading ? (
              <Loader size="xs" />
            ) : (
              <Checkbox
                onChange={handleIsPaidChange}
                color={product.isPaid ? "gray.4" : "blue"}
                checked={product.isPaid}
              />
            )}
            {deleteProductMutation.isLoading ? (
              <Loader size="xs" color="red" />
            ) : (
              <Checkbox
                onChange={deleteProductHandler}
                color={product.isPaid ? "gray.4" : "red"}
                checked={product.deleted}
              />
            )}
          </div>
        </div>
      </div>
    </li>
  );
};
