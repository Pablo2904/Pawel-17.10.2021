import { ordersHandler } from "./ordersHandler";
import { OrdersList } from "types";
import { cloneDeep } from "lodash";

const defaultOrders = {
  asks: {},
  bids: {},
};

const mockedData = {
  PI_ETHUSD: {
    asks: {
      1000: 200,
      999: 100,
    },
    bids: {
      1000: 200,
      999: 100,
    },
  },
  PI_XBTUSD: {
    ...defaultOrders,
  },
};

const newOrders: OrdersList = [
  [12, 23],
  [1, 1],
];
const newOrdersToOverWrite: OrdersList = [
  [1000, 1],
  [999, 1],
];
const newOrderdsToRemove: OrdersList = [
  [1000, 0],
  [999, 0],
];

describe("orderHandler function", () => {
  test("adds new orders to appropriate product and action", () => {
    const newProductData = ordersHandler(
      cloneDeep(mockedData.PI_XBTUSD),
      newOrders,
      []
    );

    expect(newProductData).toEqual(
      expect.objectContaining({
        asks: { 1: 1, 12: 23 },
        bids: mockedData.PI_XBTUSD.bids,
      })
    );
  });
  test("removes empty orders", () => {
    const newProductData = ordersHandler(
      cloneDeep(mockedData.PI_ETHUSD),
      newOrderdsToRemove,
      newOrderdsToRemove
    );

    expect(newProductData).toEqual(defaultOrders);
  });
  test("not change anything with empty orders array", () => {
    const newProductData = ordersHandler(
      cloneDeep(mockedData.PI_ETHUSD),
      [],
      []
    );
    expect(newProductData).toEqual(mockedData.PI_ETHUSD);
  });
  test("overwrites only proper orders part", () => {
    const newProductData = ordersHandler(
      cloneDeep(mockedData.PI_ETHUSD),
      newOrdersToOverWrite,
      []
    );
    expect(newProductData.asks).toEqual(
      expect.objectContaining({ 1000: 1, 999: 1 })
    );
    expect(newProductData.bids).toEqual(
      expect.objectContaining(mockedData.PI_ETHUSD.bids)
    );
  });
});
