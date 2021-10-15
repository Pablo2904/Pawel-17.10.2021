import { memo } from "react";
import { OrdersActions } from "types";
import { OrderProgress, RowWrapper } from "./OrderBookRow.styles";
import OrderBookCell from "components/OrderBookCell";
import colors from "styles";

export type OrderBookRowPropsType = {
  price?: string;
  size?: number;
  total?: number;
  precentageCoverage?: number;
  type?: OrdersActions;
  colorOverride?: string;
};

export const OrderBookRow = memo(
  ({
    price,
    size,
    total,
    precentageCoverage,
    colorOverride,
    type,
  }: OrderBookRowPropsType) => {
    const isBid = type === OrdersActions.BIDS;
    const background = isBid ? colors.greenBackground : colors.redBackground;
    const color = isBid ? colors.greeFont : colors.redFont;
    const isHeader = !price || !size || !total;
    const headers = ["PRICE", "SIZE", "TOTAL"];
    const cells = isHeader
      ? headers
      : [
          Number(price).toLocaleString("en", { minimumFractionDigits: 2 }),
          size.toLocaleString("en"),
          total.toLocaleString("en"),
        ];
    return (
      <RowWrapper isHeader={isHeader} isBid={isBid}>
        {!isHeader && (
          <OrderProgress
            isBid={isBid}
            precentageCoverage={precentageCoverage}
            color={background}
          />
        )}
        {cells.map((content, index) => (
          <OrderBookCell
            content={content}
            color={colorOverride || (index === 0 ? color : "")}
            isBid={isBid}
            key={`${type}-${headers[index]}-${content}`}
            isHeader={isHeader}
          />
        ))}
      </RowWrapper>
    );
  }
);
