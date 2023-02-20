import { Indicator, NumberInput, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import React, { FC } from "react";

export const ModalContent: FC = () => (
  <div>
    <form className="space-y-4">
      <NumberInput
        label="金額"
        classNames={{
          label: "text-sm text-slate-500",
        }}
        defaultValue={1000}
        parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
        formatter={(value) =>
          !Number.isNaN(parseFloat(value ?? ""))
            ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
            : "$ "
        }
      />
      <TextInput
        placeholder="商品名を入力してね"
        classNames={{
          label: "text-sm text-slate-500",
        }}
        label="商品名"
      />
      <Select
        label="購入場所"
        placeholder="買った場所を選んでね"
        classNames={{
          label: "text-sm text-slate-500",
        }}
        data={[
          { value: "amazon", label: "Amazon" },
          { value: "mercari", label: "メルカリ" },
          { value: "other", label: "その他" },
        ]}
      />
      <DatePicker
        firstDayOfWeek="sunday"
        locale="ja"
        placeholder="日付を選んでね"
        label="購入した日付"
        inputFormat="YYYY年MM月DD日"
        labelFormat="YYYY年MM月DD日"
        renderDay={(date) => {
          const day = date.getDate();
          const isToday = date.toDateString() === new Date().toDateString();

          if (date.getDay() === 6) {
            return (
              <Indicator size={6} color="red" offset={8} disabled={!isToday}>
                <div className="text-blue-500">{day}</div>
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
    </form>
  </div>
);
