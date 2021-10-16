import styled from "styled-components";
import colors from "../styles";

export const AppMainContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  height: fit-content;
`;

export const AppContainerWrapper = styled.div`
  background: ${colors.blackCharcoal};
  color: ${colors.milkWhite};
  min-height: 100vh;
`;
