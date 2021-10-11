import OrderBookRow from "../OrderBookRow";
import OrderBookSpread from "../OrderBookSpread";
import {
  OrderBookWrapper,
  OrderBookPart,
  OrderBookRowsContainer,
  OrderBookLoading,
} from "./OrderBookContainer.styles";
import { Orders, OrderBookOrdersDict } from "../types";
import colors from "../styles";

type OrderBookSpreadProps = {
  orders: OrderBookOrdersDict;
};

export const OrderBookContainer = ({ orders }: OrderBookSpreadProps) => {
  const { asks, bids } = orders;
  const askPrices = Object.keys(asks);
  const bidPrices = Object.keys(bids);
  if (!askPrices.length && !bidPrices.length)
    return <OrderBookLoading>Loading...</OrderBookLoading>;
  const bestTwentyAsks = askPrices?.splice(0, 20);
  const bestTwentyBids = bidPrices?.splice(-20);
  const lowestAskPrice = Number(bestTwentyAsks[0]);
  const highestBidPrice = Number(bestTwentyBids[0]);
  const spread = lowestAskPrice - highestBidPrice;
  const precentageSpread = (
    (spread / (lowestAskPrice + highestBidPrice)) *
    100
  ).toFixed(2);

  const totalDict: { [order in Orders]: { [index: number]: number } } = {
    asks: {},
    bids: {},
  };

  bestTwentyBids.reduce(
    (curr, next, index) => {
      totalDict.asks[index] = curr.ask;
      totalDict.bids[index] = curr.bid;
      return {
        bid: curr.bid + bids[bestTwentyBids[index + 1]],
        ask: curr.ask + asks[bestTwentyAsks[index + 1]],
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
        <OrderBookRow colorOverride={colors.grey} type={Orders.BIDS} />
        {bestTwentyBids.map((price, index) => {
          const precentageCoverage =
            (totalDict.bids[index] / totalDict.bids[19]) * 100;
          return (
            <OrderBookRow
              key={`bids-${price}`}
              price={price}
              size={bids[price]}
              total={totalDict.bids[index]}
              precentageCoverage={precentageCoverage}
              type={Orders.BIDS}
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
              (totalDict.asks[index] / totalDict.asks[19]) * 100;
            return (
              <OrderBookRow
                key={`asks-${price}`}
                price={price}
                size={asks[price]}
                total={totalDict.asks[index]}
                precentageCoverage={precentageCoverage}
                type={Orders.ASKS}
              />
            );
          })}
        </OrderBookRowsContainer>
      </OrderBookPart>
    </OrderBookWrapper>
  );
};
