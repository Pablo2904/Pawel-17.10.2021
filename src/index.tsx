import { StrictMode } from "react";
import ReactDOM from "react-dom";
import AppContainer from "./AppContainer";
import ErrorBoundary from "./ErrorBoundary";
import { GlobalStyle } from "./styles";

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <ErrorBoundary>
      <AppContainer />
    </ErrorBoundary>
  </StrictMode>,
  document.getElementById("root")
);
