import { createGlobalStyle } from "styled-components";

export const colors = {
  black: "#000000",
  blackCharcoal: "#0d1323",
  white: "#ffffff",
  milkWhite: "#d4deea",
  grey: "#676c75",
  greenBackground: "#002e34",
  greeFont: "#00765f",
  redBackground: "#2f1728",
  redFont: "#9a2133",
  darkorchid: "#9932cc",
};

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;
