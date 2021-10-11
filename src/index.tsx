import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { WebSockets } from "./WebSocket/WebSockets";
import { GlobalStyle } from "./styles";

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <WebSockets />
  </StrictMode>,
  document.getElementById("root")
);
