import {
  Button,
  Indicator,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import React, { FC } from "react";
import { useMutateProduct } from "src/features/products/api/useMutateProduct";
import { useInputProductState } from "src/features/products/store";
import { InputProductSchema } from "src/features/products/types";
import { useGlobalState } from "src/store/input";

export const ModalContent: FC = () => {
  const setInputProduct = useInputProductState(
    (state) => state.setInputProduct
  );
  const inputProduct = useInputProductState((state) => state.inputProduct);
  const { inputProductMutation } = useMutateProduct();
  const setModal = useGlobalState((state) => state.setModal);

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const validate = InputProductSchema.parse(inputProduct);
      await inputProductMutation.mutateAsync(validate);
      setModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleAddProduct} className="flex flex-col space-y-4">
        <NumberInput
          label="金額"
          classNames={{
            label: "text-sm text-slate-500",
          }}
          defaultValue={0}
          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
          formatter={(value) =>
            !Number.isNaN(parseFloat(value ?? ""))
              ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : "$ "
          }
          onChange={(event) => {
            setInputProduct({
              ...inputProduct,
              price: event ?? 0,
            });
          }}
        />
        <TextInput
          placeholder="商品名を入力してね"
          classNames={{
            label: "text-sm text-slate-500",
          }}
          label="商品名"
          onChange={(event) => {
            setInputProduct({
              ...inputProduct,
              name: event.target.value,
            });
          }}
        />
        <Select
          label="購入場所"
          placeholder="買った場所を選んでね"
          classNames={{
            label: "text-sm text-slate-500",
          }}
          data={[
            { value: "amazon", label: "Amazon" },
            { value: "メルカリ", label: "メルカリ" },
            { value: "other", label: "その他" },
          ]}
          onChange={(event) => {
            setInputProduct({
              ...inputProduct,
              boughtSite: event ?? "",
            });
          }}
        />
        <DatePicker
          firstDayOfWeek="sunday"
          locale="ja"
          placeholder="日付を選んでね"
          label="購入した日付"
          inputFormat="YYYY年MM月DD日"
          labelFormat="YYYY年MM月DD日"
          onChange={(date) => {
            setInputProduct({
              ...inputProduct,
              boughtDay: date ?? new Date(),
            });
          }}
          renderDay={(date) => {
            const day = date.getDate();
            const isToday = date.toDateString() === new Date().toDateString();

            if (date.getDay() === 6) {
              return (
                <Indicator size={6} color="red" offset={8} disabled={!isToday}>
                  <div
                    className={`text-blue-500 ${
                      inputProduct.boughtDay.toDateString() ===
                      date.toDateString()
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                  >
                    {day}
                  </div>
                </Indicator>
              );
            }

            return (
              <Indicator size={6} color="red" offset={8} disabled={!isToday}>
                <div>{day}</div>
              </Indicator>
            );
          }}
        />
        <Button type="submit" className="ml-auto max-w-md">
          登録
        </Button>
      </form>
    </div>
  );
};
