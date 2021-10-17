export enum OrdersActions {
  ASKS = "asks",
  BIDS = "bids",
}

export enum ProductsIds {
  PI_XBTUSD = "PI_XBTUSD",
  PI_ETHUSD = "PI_ETHUSD",
}

export enum FeedsEvents {
  BOOK = "book_ui_1",
  SNAP = "book_ui_1_snapshot",
}

export type OrderBookOrdersDict = {
  [Action in OrdersActions]: {
    [price: string]: number;
  };
};

export type OrderBookData = {
  [Product in ProductsIds]: OrderBookOrdersDict;
};

export type OrdersList = [number, number][];
export type OrdersData = {
  [Order in OrdersActions]?: OrdersList;
};
