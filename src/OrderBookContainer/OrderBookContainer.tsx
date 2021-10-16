import OrderBookRow from "../OrderBookRow";
import OrderBookSpread from "../OrderBookSpread";
import {
  OrderBookWrapper,
  OrderBookPart,
  OrderBookRowsContainer,
  OrderBookLoading,
} from "./OrderBookContainer.styles";
import { OrdersActions, OrderBookOrdersDict } from "../types";
import colors from "../styles";

type OrderBookSpreadPropsType = {
  orders: OrderBookOrdersDict;
};

export const OrderBookContainer = ({ orders }: OrderBookSpreadPropsType) => {
  const ROWS_AMOUNT = 20;
  const { asks, bids } = orders;
  const askPrices = Object.keys(asks).sort((next, curr) =>
    next.localeCompare(curr, undefined, { numeric: true })
  );
  const bidPrices = Object.keys(bids).sort((next, curr) =>
    next.localeCompare(curr, undefined, { numeric: true })
  );
  if (!askPrices.length && !bidPrices.length)
    return <OrderBookLoading>Loading...</OrderBookLoading>;
  const bestTwentyAsks = askPrices?.slice(0, ROWS_AMOUNT);
  const bestTwentyBids = bidPrices?.slice(-ROWS_AMOUNT).reverse();
  const lowestAskPrice = Number(bestTwentyAsks[0]);
  const highestBidPrice = Number(bestTwentyBids[0]);
  const spread = lowestAskPrice - highestBidPrice;
  const precentageSpread =
    !Number.isNaN(spread) &&
    ((spread / (lowestAskPrice + highestBidPrice)) * 100).toFixed(2);

  const totalDict: { [order in OrdersActions]: { [index: number]: number } } = {
    asks: {},
    bids: {},
  };

  new Array(ROWS_AMOUNT).fill("").reduce(
    (curr, next, index) => {
      totalDict.asks[index] = curr.ask;
      totalDict.bids[index] = curr.bid;
      return {
        bid: curr.bid + (bids[bestTwentyBids[index + 1]] || 0),
        ask: curr.ask + (asks[bestTwentyAsks[index + 1]] || 0),
      };
    },
    {
      ask: asks[bestTwentyAsks[0]],
      bid: bids[bestTwentyBids[0]],
    }
  );
  return (
    <OrderBookWrapper>
      <OrderBookPart>
        <OrderBookRow colorOverride={colors.grey} type={OrdersActions.BIDS} />
        {bestTwentyBids.map((price, index) => {
          const precentageCoverage =
            (totalDict.bids[index] / totalDict.bids[ROWS_AMOUNT - 1]) * 100;
          return (
            <OrderBookRow
              key={`bids-${price}`}
              price={price}
              size={bids[price]}
              total={totalDict.bids[index]}
              precentageCoverage={precentageCoverage}
              type={OrdersActions.BIDS}
            />
          );
        })}
      </OrderBookPart>
      <OrderBookSpread spread={spread} precentageSpread={precentageSpread} />
      <OrderBookPart>
        <OrderBookRow colorOverride={colors.grey} />
        <OrderBookRowsContainer>
          {bestTwentyAsks.map((price, index) => {
            const precentageCoverage =
              (totalDict.asks[index] / totalDict.asks[ROWS_AMOUNT - 1]) * 100;
            return (
              <OrderBookRow
                key={`asks-${price}`}
                price={price}
                size={asks[price]}
                total={totalDict.asks[index]}
                precentageCoverage={precentageCoverage}
                type={OrdersActions.ASKS}
              />
            );
          })}
        </OrderBookRowsContainer>
      </OrderBookPart>
    </OrderBookWrapper>
  );
};
