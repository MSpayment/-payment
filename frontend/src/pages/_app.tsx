import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MantineProvider, Modal } from "@mantine/core";
import queryClient from "src/libs/queryClient";
import { useGlobalState } from "src/store/input";
import { ModalContent } from "src/components/ModalContent";
import axios from "src/libs/axios";

const App = ({ Component, pageProps }: AppProps) => {
  const [client] = useState(() => queryClient);
  const modal = useGlobalState((state) => state.modal);
  const setModal = useGlobalState((state) => state.setModal);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/auth/csrf`
      );
      axios.defaults.headers.common["csrf-token"] = data.csrfToken;
    })();
  }, []);

  return (
    <QueryClientProvider client={client}>
      <Hydrate state={pageProps.dehydratedState}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            fontFamily: "futura",
            colorScheme: "light",
            primaryColor: "blue",
          }}
        >
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
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </MantineProvider>
      </Hydrate>
    </QueryClientProvider>
  );
};

export default App;
