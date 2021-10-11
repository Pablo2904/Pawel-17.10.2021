import styled from "styled-components";

export const OrderBookWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

export const OrderBookPart = styled.div`
  width: 50%;
  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const OrderBookRowsContainer = styled.div`
  @media (max-width: 480px) {
    display: flex;
    flex-direction: column-reverse;
  }
`;

export const OrderBookLoading = styled.div`
  padding: 24px;
`;
