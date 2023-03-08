import { Modal } from "@mantine/core";
import React, { FC } from "react";
import { ModalContent } from "src/components/ModalContent";
import { useQueryProducts } from "src/features/products/api/useQueryProducts";
import { ProductList } from "src/features/products/components/ProductList";
import { useGlobalState } from "src/store/input";

export const Products: FC = () => {
  const { data } = useQueryProducts();
  const modal = useGlobalState((state) => state.modal);
  const setModal = useGlobalState((state) => state.setModal);

  return (
    <>
      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        title="購入したものを入力"
        classNames={{
          title: "text-2xl font-bold mx-auto text-blue-500",
          overlay: "bg-gray-900 bg-opacity-50",
        }}
        centered
        radius="md"
      >
        <ModalContent />
      </Modal>
      <ul className="p-6">
        {data?.map((productList) => (
          <ProductList productList={productList} key={productList.id} />
        ))}
      </ul>
    </>
  );
};
