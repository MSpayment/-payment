import { ActionIcon } from "@mantine/core";
import { PlusIcon } from "@heroicons/react/24/solid";
import { NextPage } from "next";
import React from "react";
import { useGlobalState } from "src/store/input";
import { Products } from "src/features/products/components/Products";

const Dashboard: NextPage = () => {
  const setModal = useGlobalState((state) => state.setModal);

  return (
    <div>
      <main className="min-h-screen">
        <div className="container mx-auto h-full min-h-screen ">
          <Products />
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
