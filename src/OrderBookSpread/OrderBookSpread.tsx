import { OrderBookOrdersDict } from "../WebSocket/WebSockets";

type OrderBookSpreadProps = {
  orders: OrderBookOrdersDict;
};

export const OrderBookSpread = ({ orders }: OrderBookSpreadProps) => {
  const { asks, bids } = orders;
  const askPrices = Object.keys(asks);
  const bidPrices = Object.keys(bids);

  if (!askPrices.length && !bidPrices.length) return <>Loading...</>;

  const bestTwentyAsks = askPrices?.splice(0, 20);
  const bestTwentyBids = bidPrices?.splice(-20);
  const lowestAsk = Number(bestTwentyAsks[0]);
  const highestBid = Number(bestTwentyBids[0]);
  const spread = lowestAsk - highestBid;
  const precentSpread = ((spread / (lowestAsk + highestBid)) * 100).toFixed(2);
  const totalDict: { [key: string]: { [index: number]: number } } = {
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        //zmiana na column-revers na mobilce, usuniecie abolute ze spread i szerokosci z askow i bidow
      }}
    >
      <div
        style={{
          width: "50%",
          background: "grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <span
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            Total
          </span>
          <span
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            Size
          </span>
          <span
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            PRICE
          </span>
        </div>
        {bestTwentyBids.map((price, index) => {
          const amount = (totalDict.bids[index] / totalDict.bids[19]) * 100;
          const gradient = `linear-gradient(to left, #09a043  ${amount}%, #fff ${amount}%)`;

          return (
            <div
              key={price}
              style={{
                display: "flex",
                justifyContent: "space-around",
                background: gradient,
              }}
            >
              <span
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {totalDict.bids[index]}1
              </span>
              <span
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {bids[price].toLocaleString("en")}
              </span>
              <span
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {Number(price).toLocaleString("en")}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: "0" }}>
        Spread {spread.toFixed(1)} ({precentSpread}%)
      </div>
      <div
        style={{
          width: "50%",
          background: "grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <span
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            Price
          </span>
          <span
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            Size
          </span>
          <span
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            Total
          </span>
        </div>
        {bestTwentyAsks.map((price, index) => {
          const amount = (totalDict.asks[index] / totalDict.asks[19]) * 100;
          const gradient = `linear-gradient(to right, rgba(255,0,0,1) ${amount}%, #fff ${amount}%)`;
          return (
            <div
              key={price}
              style={{
                display: "flex",
                justifyContent: "space-around",
                background: gradient,
              }}
            >
              <span
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                {Number(price).toLocaleString("en")}
              </span>
              <span
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                {asks[price].toLocaleString("en")}
              </span>
              <span
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                {totalDict.asks[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
