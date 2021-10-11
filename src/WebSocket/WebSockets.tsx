import { useCallback, useEffect, useMemo, useState } from "react";
import useWebSocket from "react-use-websocket";
import cloneDeep from "lodash.clonedeep";
import { useFPSCore } from "fps-react";
import { useInterval, useTabBlurFocus, TabState } from "../Hooks";
import OrderBookContainer from "../OrderBookContainer";
import OrderBookHeader from "../OrderBookHeader";
import { Feeds, Orders, ProductsIds, OrderBookOrdersDict } from "../types";
import { WebSocketWrapper, AppContainerWrapper } from "./WebSockets.styles";
import Button from "../Button";
import Overlay from "../Overlay";

type OrderBookData = {
  [Product in ProductsIds]: OrderBookOrdersDict;
};

type OrderList = [number, number][];
type OrdersData = {
  [order in Orders]: OrderList;
};

enum ConnectionEvent {
  subscribe = "subscribe",
  unsubscribe = "unsubscribe",
}

type RequestData = {
  feed: Feeds;
  product_id?: ProductsIds;
  event?: string;
} & OrdersData;

export const WebSockets = () => {
  const SOCKET_URL = "wss://www.cryptofacilities.com/ws/v1";
  const RECONNECT_ATTEMPS_AMOUNT = 10;
  const [selectedId, setSelectedId] = useState<ProductsIds>(
    ProductsIds.PI_XBTUSD
  );
  const prevSelectedId =
    selectedId === ProductsIds.PI_XBTUSD
      ? ProductsIds.PI_ETHUSD
      : ProductsIds.PI_XBTUSD;
  const [stopThrottle, setStopThrottle] = useState(false);
  const [delayInterval, setDelayInterval] = useState(1000);
  const [tickThrottle, setTickThrottle] = useState(false);
  const [errorWS, setErrorWS] = useState<string | undefined>();
  const [recconectAttemps, setRecconectAttemps] = useState(
    RECONNECT_ATTEMPS_AMOUNT
  );
  const defaultObject = Object.fromEntries(
    (Object.keys(ProductsIds) as Array<keyof typeof ProductsIds>).map(
      (productId) => [productId, { asks: {}, bids: {} }]
    )
  ) as OrderBookData;
  const [data, setData] = useState<OrderBookData>(defaultObject);

  const shouldRenderFPS = window.location.search.match("fps=true");
  const { sendMessage, lastMessage } = useWebSocket(SOCKET_URL, {
    shouldReconnect: () => true,
    retryOnError: true,
    reconnectInterval: 3000,
    reconnectAttempts: RECONNECT_ATTEMPS_AMOUNT,
    onError: () => {
      setRecconectAttemps((curr) => curr - 1);
      setErrorWS("There is some error with connection, trying to reconnect...");
    },
    onOpen: () =>
      errorWS &&
      setErrorWS(undefined) &&
      setRecconectAttemps(RECONNECT_ATTEMPS_AMOUNT),
  });
  const tabState = useTabBlurFocus();
  const { fps } = useFPSCore({ fpsHistory: 5 });
  const averageFps =
    fps.length > 0 &&
    Math.round(fps.reduce((curr, next) => curr + next, 0) / fps.length);

  const handleData = (message: RequestData) => {
    const handleNewOrders = (
      clonedData: OrderBookData,
      newOrders: OrderList,
      orderType: Orders,
      productId: ProductsIds
    ) => {
      const currentProduct = clonedData[productId];
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

    const productId = message?.product_id;
    if (productId && !Boolean(message.event)) {
      const asks = message.asks;
      const bids = message.bids;
      const isAsks = asks.length > 0;
      const isBids = bids.length > 0;

      if (!isAsks && !isBids) return;

      const clonedData = cloneDeep(data);

      if (isAsks) {
        handleNewOrders(clonedData, asks, Orders.ASKS, productId);
      }

      if (isBids) {
        handleNewOrders(clonedData, bids, Orders.BIDS, productId);
      }
      setData(clonedData);
    }
  };
  const onToogleClick = () => {
    setStopThrottle(false);
    setSelectedId(prevSelectedId);
  };
  const handleConnect = (event: ConnectionEvent, product_ids: ProductsIds) =>
    sendMessage(
      JSON.stringify({
        event,
        feed: "book_ui_1",
        product_ids: [product_ids],
      })
    );

  const resumeSubscribe = useCallback(() => {
    setStopThrottle(false);
    handleConnect(ConnectionEvent.subscribe, selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (recconectAttemps < 1)
      setErrorWS(
        "Coudn't reconnect, try to reload page or please contact our support team."
      );
  }, [recconectAttemps]);
  useEffect(() => {
    lastMessage && handleData(JSON.parse(lastMessage.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  useEffect(() => {
    if (tabState === TabState.BLUR) {
      setStopThrottle(true);
      handleConnect(ConnectionEvent.unsubscribe, selectedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabState]);

  useEffect(() => {
    handleConnect(ConnectionEvent.unsubscribe, prevSelectedId);
    const clearedOldData = {
      ...cloneDeep(data),
      ...(data[prevSelectedId].asks = {}),
      ...(data[prevSelectedId].bids = {}),
    };
    setData(clearedOldData);
    handleConnect(ConnectionEvent.subscribe, selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    if (!averageFps) return;
    if (averageFps < 59 && averageFps > 56) {
      delayInterval !== 2000 && setDelayInterval(2000);
    } else if (averageFps <= 56) {
      delayInterval !== 3500 && setDelayInterval(3500);
    } else {
      delayInterval !== 1000 && setDelayInterval(1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [averageFps]);

  useInterval(() => {
    setTickThrottle(!tickThrottle);
  }, delayInterval);
  const throttledTicker = stopThrottle ? undefined : tickThrottle;

  const orderBookContainer = useMemo(
    () => <OrderBookContainer orders={data[selectedId]} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [throttledTicker, selectedId]
  );
  const isError = errorWS || stopThrottle;
  const errorMsg = errorWS ?? "Hey, just confirm, that You are still with us!";
  const errorCallback = stopThrottle && !errorWS ? resumeSubscribe : undefined;
  return (
    <AppContainerWrapper>
      <WebSocketWrapper>
        <OrderBookHeader />
        {orderBookContainer}
        <Button onClick={onToogleClick} name="Toogle Product" />
        {shouldRenderFPS && averageFps && `FPS: ${averageFps}`}
      </WebSocketWrapper>
      {isError && <Overlay onBtnClick={errorCallback} message={errorMsg} />}
    </AppContainerWrapper>
  );
};
