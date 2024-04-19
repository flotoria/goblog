import "@/styles/globals.css";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import Header from "@/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return(
    <Provider store={store}>
      <CssBaseline />
      <Component {...pageProps} />
   </Provider>
  )
}
