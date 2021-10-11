import { memo } from "react";
import { RowCell } from "./OrderBookCell.styles";

type OrderBookCellPropsType = {
  content: string;
  isBid: boolean;
  isHeader?: boolean;
  color?: string;
};

export const OrderBookCell = memo(
  ({ content, isHeader, isBid, color }: OrderBookCellPropsType) => (
    <RowCell color={color} isBid={isBid} isHeader={isHeader}>
      {content}
    </RowCell>
  )
);
