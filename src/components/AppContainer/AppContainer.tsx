import { useCallback, useEffect, useMemo, useState } from "react";
import useWebSocket from "react-use-websocket";
import cloneDeep from "lodash.clonedeep";
import { useFPSCore } from "fps-react";
import { useInterval, useTabBlurFocus, TabState } from "hooks";
import OrderBookContainer from "components/OrderBookContainer";
import OrderBookHeader from "components/OrderBookHeader";
import { FeedsEvents, ProductsIds, OrdersData, OrderBookData } from "types";
import { ordersHandler } from "utils";
import { AppMainContainer, AppContainerWrapper } from "./AppContainer.styles";
import Button from "components/Button";
import Overlay from "components/Overlay";

enum RequestEvents {
  unsubscribe = "unsubscribe",
  subscribe = "subscribe",
}

enum ResponseEvents {
  unsubscribed = "unsubscribed",
  subscribed = "subscribed",
}

type ResponseData = {
  feed?: FeedsEvents;
  product_id?: ProductsIds;
  event?: string;
} & OrdersData;

export const AppContainer = () => {
  const SOCKET_URL = "wss://www.cryptofacilities.com/ws/v1";
  const RECONNECT_ATTEMPS_AMOUNT = 10;
  const RECONNECT_INTERVAL = 3000;
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
    reconnectInterval: RECONNECT_INTERVAL,
    reconnectAttempts: RECONNECT_ATTEMPS_AMOUNT,
    onError: () => {
      setRecconectAttemps((curr) => curr - 1);
      setErrorWS("There is some error with connection, trying to reconnect...");
    },
    onOpen: () => {
      if (errorWS) {
        setErrorWS(undefined);
        setRecconectAttemps(RECONNECT_ATTEMPS_AMOUNT);
      }
    },
  });
  const tabState = useTabBlurFocus();
  const { fps } = useFPSCore({ fpsHistory: 5 });
  const averageFps =
    fps.length > 0 &&
    Math.round(fps.reduce((curr, next) => curr + next, 0) / fps.length);

  const handleData = (message: ResponseData) => {
    if (message.event === ResponseEvents.unsubscribed) {
      return setData(defaultObject);
    }

    const productId = message?.product_id;
    const feed = message?.feed;
    const asks = message?.asks;
    const bids = message?.bids;
    if (
      feed &&
      Object.values(FeedsEvents).includes(feed) &&
      productId &&
      asks &&
      bids
    ) {
      if (asks.length < 1 && bids.length < 1) return;
      const clonedData = cloneDeep(data);
      const currentProduct = clonedData[productId];
      if (!currentProduct) return;

      const newProductData = ordersHandler(currentProduct, asks, bids);

      setData({ ...clonedData, [productId]: newProductData });
    }
  };
  const onToogleClick = useCallback(() => {
    setStopThrottle(false);
    setSelectedId(prevSelectedId);
  }, [prevSelectedId]);
  const handleConnect = (event: RequestEvents, product_ids: ProductsIds) =>
    sendMessage(
      JSON.stringify({
        event,
        feed: FeedsEvents.BOOK,
        product_ids: [product_ids],
      })
    );
  const resumeSubscribe = useCallback(() => {
    setStopThrottle(false);
    handleConnect(RequestEvents.subscribe, selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    if (recconectAttemps < 1)
      setErrorWS(
        "Couldn't reconnect, try to reload page or please contact our support team."
      );
  }, [recconectAttemps]);

  useEffect(() => {
    lastMessage && handleData(JSON.parse(lastMessage.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  useEffect(() => {
    if (tabState === TabState.BLUR) {
      setStopThrottle(true);
      handleConnect(RequestEvents.unsubscribe, selectedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabState]);

  useEffect(() => {
    handleConnect(RequestEvents.unsubscribe, prevSelectedId);
    handleConnect(RequestEvents.subscribe, selectedId);
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
      <main>
        <AppMainContainer>
          <OrderBookHeader />
          {orderBookContainer}
          <Button
            dataTestid="toogle-products"
            onClick={onToogleClick}
            name="Toogle Product"
          />
          {shouldRenderFPS && averageFps && `FPS: ${averageFps}`}
        </AppMainContainer>
      </main>
      {isError && <Overlay onBtnClick={errorCallback} message={errorMsg} />}
    </AppContainerWrapper>
  );
};
