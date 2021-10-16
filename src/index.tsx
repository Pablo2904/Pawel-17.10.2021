import { StrictMode } from "react";
import ReactDOM from "react-dom";
import AppContainer from "components/AppContainer";
import ErrorBoundary from "components/ErrorBoundary";
import { GlobalStyle } from "styles";

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <ErrorBoundary>
      <AppContainer />
    </ErrorBoundary>
  </StrictMode>,
  document.getElementById("root")
);
