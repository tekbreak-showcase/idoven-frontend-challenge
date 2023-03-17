import Head from "next/head";
import React from "react";
import { App } from "#/components/app";
import { createTheme, ThemeProvider } from "@mui/material";

export default function Home() {
  const theme = createTheme();
  return (
    <>
      <Head>
        <title>Idoven</title>
        <meta name="description" content="Idoven" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </>
  );
}
