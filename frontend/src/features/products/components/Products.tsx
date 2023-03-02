import React, { FC } from "react";
import { useQueryProducts } from "src/features/products/api/useQueryProducts";
import { ProductsItem } from "src/features/products/components/ProductsItem";

export const Products: FC = () => {
  const { data } = useQueryProducts();

  return (
    <ul className="p-6">
      {data?.map((product) => (
        <ProductsItem key={product.id} product={product} />
      ))}
    </ul>
  );
};
