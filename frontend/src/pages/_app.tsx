import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MantineProvider } from "@mantine/core";
import queryClient from "src/libs/queryClient";

const App = ({ Component, pageProps }: AppProps) => {
  const [client] = useState(() => queryClient);

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
            colors: {
              indigo: [
                "#f0f5ff",
                "#eef2ff",
                "#e0e7ff",
                "#c7d2fe",
                "#a5b4fc",
                "#818cf8",
                "#6366f1",
                "#4f46e5",
                "#4338ca",
                "#3730a3",
              ],
            },
            primaryColor: "indigo",
          }}
        >
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </MantineProvider>
      </Hydrate>
    </QueryClientProvider>
  );
};

export default App;
