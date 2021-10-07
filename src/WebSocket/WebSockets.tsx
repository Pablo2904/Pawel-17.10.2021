import { useEffect, useMemo, useState } from "react";
import useWebSocket, { Options } from "react-use-websocket";
import { useInterval } from "../Hooks";
import cloneDeep from "lodash.clonedeep";
import { OrderBookSpread } from "../OrderBookSpread/OrderBookSpread";
import { OrderBookHeader } from "../OrderBookHeader/OrderBookHeader";
import FPSStats from "react-fps-stats";

export enum ProductsIds {
  PI_XBTUSD = "PI_XBTUSD",
  PI_ETHUSD = "PI_ETHUSD",
}

enum Orders {
  ASKS = "asks",
  BIDS = "bids",
}

enum Feeds {
  BOOK = "book_ui_1",
  SNAP = "book_ui_1_snapshot",
}

export type OrderBookOrdersDict = {
  [Operation in Orders]: {
    [price: string]: number;
  };
};

export type OrderBookData = {
  [Product in ProductsIds]: OrderBookOrdersDict;
};

type OrderList = [number, number][];
type OrdersData = {
  [order in Orders]: OrderList;
};

type RequestData = {
  feed: Feeds;
  product_id: ProductsIds;
  event?: string;
} & OrdersData;

export const WebSockets = () => {
  const SOCKET_URL = "wss://www.cryptofacilities.com/ws/v1";
  const [selectedId, setSelectedId] = useState<ProductsIds>(
    ProductsIds.PI_XBTUSD
  );
  const prevSelectedId =
    selectedId === ProductsIds.PI_XBTUSD
      ? ProductsIds.PI_ETHUSD
      : ProductsIds.PI_XBTUSD;

  const defaultObject = Object.fromEntries(
    (Object.keys(ProductsIds) as Array<keyof typeof ProductsIds>).map(
      (productId) => [productId, { asks: {}, bids: {} }]
    )
  ) as OrderBookData;
  const [data, setData] = useState<OrderBookData>(defaultObject);

  const webSocketOptions: Options = {
    shouldReconnect: () => true,
    retryOnError: true,
    reconnectInterval: 3000,
    reconnectAttempts: 5,
    onError: (e) => console.log(e),
  };

  const { sendMessage, lastMessage } = useWebSocket(
    SOCKET_URL,
    webSocketOptions
  );

  const handleData = (message: RequestData, data: OrderBookData) => {
    const handleNewOrders = (
      data: OrderBookData,
      newOrders: OrderList,
      orderType: Orders
    ) => {
      const currentProduct = data[productId];
      if (currentProduct) {
        newOrders.forEach((singleOrder) => {
          const orderPrice = singleOrder[0];
          const orderAmount = singleOrder[1];
          const currentOrders = currentProduct[orderType];

          if (orderAmount === 0) {
            delete currentOrders[orderPrice];
            return;
          }
          currentOrders[orderPrice] = orderAmount;
          return;
        });
      }
    };

    if (Boolean(message.event)) return;
    const productId = message.product_id;
    const asks = message.asks;
    const bids = message.bids;
    const isAsks = asks.length > 0;
    const isBids = bids.length > 0;

    if (!isAsks && !isBids) return;

    const clonedData = cloneDeep(data);

    if (isAsks) {
      handleNewOrders(clonedData, asks, Orders.ASKS);
    }

    if (isBids) {
      handleNewOrders(clonedData, bids, Orders.BIDS);
    }
    setData(clonedData);
  };
  useEffect(() => {
    lastMessage && handleData(JSON.parse(lastMessage.data), data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);
  const onToogleClick = () => {
    setEnd(true);
    setSelectedId(prevSelectedId);
  };
  const [end, setEnd] = useState(false);
  const onEndSubscribe = () => {
    setEnd(true);
    sendMessage(
      JSON.stringify({
        event: "unsubscribe",
        feed: "book_ui_1",
        product_ids: [selectedId],
      })
    );
  };

  useEffect(() => {
    sendMessage(
      JSON.stringify({
        event: "unsubscribe",
        feed: "book_ui_1",
        product_ids: [prevSelectedId],
      })
    );
    const clearedOldData = {
      ...cloneDeep(data),
      ...(data[prevSelectedId].asks = {}),
      ...(data[prevSelectedId].bids = {}),
    };
    setData(clearedOldData);
    sendMessage(
      JSON.stringify({
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: [selectedId],
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);
  const [val, setVal] = useState(700);
  const [tickThrottle, setTickThrottle] = useState(true);
  useInterval(() => {
    setTickThrottle(!tickThrottle);
  }, val);

  const orderSpread = useMemo(
    () => <OrderBookSpread orders={data[selectedId]} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tickThrottle, selectedId]
  );
  return (
    <>
      <h1>Current Product: {selectedId}</h1>
      <button onClick={onToogleClick}>Toogle Product</button>
      <button onClick={onEndSubscribe}>End Subscibe</button>
      <input value={val} onChange={(e) => setVal(Number(e.target.value))} />
      {/* <FPSStats /> */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <OrderBookHeader />
        {orderSpread}
      </div>
    </>
  );
};
