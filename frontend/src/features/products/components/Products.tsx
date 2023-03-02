import React, { FC } from "react";
import { useQueryProducts } from "src/features/products/api/useQueryProducts";

export const Products: FC = () => {
  const { data } = useQueryProducts();

  console.log(data);

  return <ul className="p-6" />;
};
