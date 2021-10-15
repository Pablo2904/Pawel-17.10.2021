import styled from "styled-components";
import colors from "styles";

export const RowWrapper = styled.div<{
  isHeader: boolean;
  isBid: boolean;
}>`
  padding: 5px 0;
  position: relative;
  display: flex;
  justify-content: space-around;
  flex-direction: ${(props) => (props.isBid ? "row-reverse" : "row")};
  border-bottom: ${(props) => props.isHeader && `1px solid ${colors.grey}`};

  @media (max-width: 480px) {
    flex-direction: row;
    display: ${(props) => props.isHeader && props.isBid && "none"};
  }
`;

export const OrderProgress = styled.span.attrs(
  (props: { precentageCoverage?: number }) => ({
    style: {
      width: `${props.precentageCoverage}%`,
    },
  })
)<{
  isBid: boolean;
  color: string;
  precentageCoverage?: number;
}>`
  position: absolute;
  background: ${(props) => props.color};
  top: 0;
  height: 100%;

  ${(props) => (props.isBid ? "right" : "left")}: 0;

  @media (max-width: 480px) {
    left: 0;
  }
`;
