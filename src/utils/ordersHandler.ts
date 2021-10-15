import { OrderBookData, OrdersActions, OrdersList, ProductsIds } from "types";

export const ordersHandler = (
  clonedData: OrderBookData,
  ordersList: OrdersList,
  orderAction: OrdersActions,
  productId: ProductsIds
) => {
  if (ordersList.length < 1) return;
  const currentProduct = clonedData[productId];
  if (currentProduct) {
    ordersList.forEach((order) => {
      const orderPrice = order[0];
      const orderAmount = order[1];
      const currentOrders = currentProduct[orderAction];

      if (orderAmount === 0) {
        delete currentOrders[orderPrice];
        return;
      }
      currentOrders[orderPrice] = orderAmount;
      return;
    });
  }
};
