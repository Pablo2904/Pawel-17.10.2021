import {
  OrdersActionsNames,
  OrdersActions,
  OrderBookOrdersDict,
  OrdersList,
} from "types";

export const ordersHandler = (
  currentProduct: OrderBookOrdersDict,
  asks: OrdersList,
  bids: OrdersList
): OrderBookOrdersDict => {
  return Object.keys(currentProduct)
    .map((key) => {
      const orderAction = currentProduct[key as OrdersActionsNames];
      const newActionData = key === OrdersActions[0] ? asks : bids;
      newActionData.map((order) => {
        const orderPrice = order[0];
        const orderAmount = order[1];

        if (orderAmount === 0) {
          return delete orderAction[orderPrice];
        }
        return (orderAction[orderPrice] = orderAmount);
      });
      return [key, orderAction];
    })
    .reduce((prev, curr) => {
      return {
        ...prev,
        [curr[0] as string]: curr[1],
      };
    }, {}) as OrderBookOrdersDict;
};
