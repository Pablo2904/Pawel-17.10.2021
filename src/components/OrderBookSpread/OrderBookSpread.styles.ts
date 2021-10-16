import styled from "styled-components";
import colors from "styles";

export const Spread = styled.div`
  margin: auto;
  padding: 8px 12px;
  color: ${colors.grey};

  @media (min-width: 481px) {
    position: absolute;
    top: 0;
  }
`;
