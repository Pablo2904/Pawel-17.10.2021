import styled from "styled-components";
import colors from "../styles";

export const StyledButton = styled.button`
  padding: 8px 16px;
  margin-bottom: 12px;
  border-radius: 4px;
  background: ${colors.darkorchid};
  border: none;
  font-weight: bold;
  color: ${colors.milkWhite};

  &:hover {
    cursor: pointer;
  }
`;
