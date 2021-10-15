import { StrictMode } from "react";
import ReactDOM from "react-dom";
import AppContainer from "components/AppContainer";
import { GlobalStyle } from "styles";

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <AppContainer />
  </StrictMode>,
  document.getElementById("root")
);
