import { memo } from "react";
import { Spread } from "./OrderBookSpread.styles";

type OrderBookSpreadProps = {
  spread: number;
  precentageSpread: string;
};

export const OrderBookSpread = memo(
  ({ spread, precentageSpread }: OrderBookSpreadProps) => (
    <Spread>
      Spread {spread.toFixed(1)} ({precentageSpread}%)
    </Spread>
  )
);
