export enum Orders {
  ASKS = "asks",
  BIDS = "bids",
}

export enum ProductsIds {
  PI_XBTUSD = "PI_XBTUSD",
  PI_ETHUSD = "PI_ETHUSD",
}

export enum Feeds {
  BOOK = "book_ui_1",
  SNAP = "book_ui_1_snapshot",
}

export type OrderBookOrdersDict = {
  [Operation in Orders]: {
    [price: string]: number;
  };
};
