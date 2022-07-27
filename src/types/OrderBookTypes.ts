export enum OrdersActions {
  "asks",
  "bids",
}
export type OrdersActionsNames = keyof typeof OrdersActions;

export enum ProductsIds {
  PI_XBTUSD = "PI_XBTUSD",
  PI_ETHUSD = "PI_ETHUSD",
}

export enum FeedsEvents {
  BOOK = "book_ui_1",
  SNAP = "book_ui_1_snapshot",
}

export type OrderBookOrdersDict = {
  [K in OrdersActionsNames]: {
    [price: string]: number;
  };
};

export type OrderBookData = {
  [Product in ProductsIds]: OrderBookOrdersDict;
};

export type OrdersList = [number, number][];
export type OrdersData = {
  [Order in OrdersActionsNames]?: OrdersList;
};
