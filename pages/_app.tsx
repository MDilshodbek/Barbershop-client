import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { light } from "../scss/MaterialTheme";
import { ApolloProvider } from "@apollo/client";
import { appWithTranslation } from "next-i18next";
import { useApollo } from "../apollo/client";
import { connectChatSocket } from "../apollo/chatSocket";
import "../scss/app.scss";
import "../scss/pc/main.scss";
import "../scss/mobile/main.scss";

const App = ({ Component, pageProps }: AppProps) => {
  // Comment: the theme never changes, so build it once
  const theme = useMemo(() => createTheme(light as Parameters<typeof createTheme>[0]), []);
  const client = useApollo(pageProps.initialApolloState);

  // Comment: open the chat socket once in the browser; connectChatSocket is a no-op if one already exists
  useEffect(() => {
    connectChatSocket();
  }, []);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default appWithTranslation(App);
