import { Modal, Text } from "@mantine/core";
import React, { FC } from "react";
import { ModalContent } from "src/components/ModalContent";
import { useQueryProducts } from "src/features/products/api/useQueryProducts";
import { ProductList } from "src/features/products/components/ProductList";
import { useSelectDateState } from "src/features/products/store";

import { useGlobalState } from "src/store/input";

export const Products: FC = () => {
  const selectDate = useSelectDateState((state) => state.date);

  const { data } = useQueryProducts(selectDate.year, selectDate.month);
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
      {data?.length === 0 ? (
        <div>
          <Text
            component="p"
            className="pt-4 text-center text-2xl font-bold text-blue-500"
          >
            まだ何も登録されていません
          </Text>
        </div>
      ) : (
        <ul className="p-4">
          {data?.map((productList) => (
            <ProductList productList={productList} key={productList?.id} />
          ))}
        </ul>
      )}
    </>
  );
};
