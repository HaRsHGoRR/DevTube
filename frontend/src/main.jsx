import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "../State/store.jsx";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};
const colors = {
  blue: {
    700: "#1A56DB",
    500:"#3F83F8",
    600: "#3182CE",
  },
  gray: {
    900: "#111827",
    600: "#4B5563",
  },
};


export const theme = extendTheme({
  colors:colors,
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "gray.900",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
  },
});




ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Provider>
  </>
);
