import styled from "styled-components";

export const RowCell = styled.span<{
  isBid: boolean;
  isHeader?: boolean;
  color?: string;
}>`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: ${(props) => (props.isBid ? "flex-end" : "flex-start")};
  color: ${(props) => props.color};
  &:nth-child(${(props) => (props.isHeader ? 1 : 2)}) {
    ${(props) => (props.isBid ? "margin-right" : "margin-left")}: 5%;
  }
  font-weight: bold;
  @media (max-width: 480px) {
    justify-content: center;

    &:nth-child(${(props) => (props.isHeader ? 1 : 2)}) {
      ${(props) => (props.isBid ? "margin-right" : "margin-left")}: 0;
    }
  }
`;
