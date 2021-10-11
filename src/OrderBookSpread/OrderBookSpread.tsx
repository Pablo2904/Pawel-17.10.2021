import { memo } from "react";
import { Spread } from "./OrderBookSpread.styles";

type OrderBookSpreadPropsType = {
  spread: number;
  precentageSpread: string;
};

export const OrderBookSpread = memo(
  ({ spread, precentageSpread }: OrderBookSpreadPropsType) => (
    <Spread>
      Spread {spread.toFixed(1)} ({precentageSpread}%)
    </Spread>
  )
);
