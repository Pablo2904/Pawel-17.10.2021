import { ordersHandler } from "./ordersHandler";
import { OrdersActions, OrdersList, ProductsIds } from "../types";
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
    const deepCloned = cloneDeep(mockedData);
    ordersHandler(
      deepCloned,
      newOrders,
      OrdersActions.ASKS,
      ProductsIds.PI_XBTUSD
    );
    expect(deepCloned.PI_XBTUSD).toEqual(
      expect.objectContaining({ asks: { 1: 1, 12: 23 }, bids: {} })
    );
    expect(deepCloned.PI_ETHUSD).toEqual(mockedData.PI_ETHUSD);
  });
  test("removes empty orders", () => {
    const deepCloned = cloneDeep(mockedData);
    ordersHandler(
      deepCloned,
      newOrderdsToRemove,
      OrdersActions.ASKS,
      ProductsIds.PI_ETHUSD
    );
    ordersHandler(
      deepCloned,
      newOrderdsToRemove,
      OrdersActions.BIDS,
      ProductsIds.PI_ETHUSD
    );
    expect(deepCloned.PI_ETHUSD).toEqual(defaultOrders);
  });
  test("not change anything with empty orders array", () => {
    const deepCloned = cloneDeep(mockedData);
    ordersHandler(deepCloned, [], OrdersActions.ASKS, ProductsIds.PI_ETHUSD);
    expect(deepCloned).toEqual(mockedData);
  });
  test("overwrites orders with new sizes", () => {
    const deepCloned = cloneDeep(mockedData);
    ordersHandler(
      deepCloned,
      newOrdersToOverWrite,
      OrdersActions.ASKS,
      ProductsIds.PI_ETHUSD
    );
    expect(deepCloned.PI_ETHUSD.asks).toEqual(
      expect.objectContaining({ 1000: 1, 999: 1 })
    );
  });
});
