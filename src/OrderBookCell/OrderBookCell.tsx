import { memo } from "react";
import { RowCell } from "./OrderBookCell.styles";

type OrderBookCellType = {
  content: string;
  isBid: boolean;
  isHeader?: boolean;
  color?: string;
};

export const OrderBookCell = memo(
  ({ content, isHeader, isBid, color }: OrderBookCellType) => (
    <RowCell color={color} isBid={isBid} isHeader={isHeader}>
      {content}
    </RowCell>
  )
);
