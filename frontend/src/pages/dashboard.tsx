import { ActionIcon, Badge, Checkbox, Text } from "@mantine/core";
import { PlusIcon } from "@heroicons/react/24/solid";
import { NextPage } from "next";
import React from "react";
import { useGlobalState } from "src/store/input";

const Dashboard: NextPage = () => {
  const setModal = useGlobalState((state) => state.setModal);

  return (
    <div>
      <main className="min-h-screen">
        <div className="container mx-auto h-full min-h-screen ">
          <ul className=" p-6">
            <li className="border-0 border-b border-solid border-slate-200 py-4">
              <Text className="sticky top-0 bg-white">2021/01/01</Text>
              <ul className="mt-2">
                <li className="flex justify-center space-x-4">
                  <div className="flex flex-1">
                    <div className="flex flex-[2] space-x-2">
                      <Badge className="my-1 min-w-max">メルカリ</Badge>
                      <div>商品名</div>
                    </div>
                    <div className="flex-1 text-right">1.000円</div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Checkbox>1</Checkbox>
                    <Checkbox color="red">2</Checkbox>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </main>
      <ActionIcon
        className="fixed bottom-10 right-10 shadow-md"
        variant="filled"
        size="xl"
        radius="xl"
        color="blue"
        onClick={() => setModal(true)}
      >
        <PlusIcon className="h-6 w-6" />
      </ActionIcon>
    </div>
  );
};

export default Dashboard;
