import { render, screen } from "@testing-library/react";
import { OrderBookContainer } from "./OrderBookContainer";

const lowestAsk = 1.5;
const highestBid = 22;
const orders = {
  asks: {
    6.5: 1,
    [lowestAsk]: 2,
    7.5: 3,
    2: 4,
  },
  bids: {},
};

const bids = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 1,
  8: 1,
  9: 1,
  10: 1,
  11: 1,
  12: 1,
  13: 1,
  14: 1,
  15: 1,
  16: 1,
  17: 1,
  18: 1,
  19: 1,
  20: 1,
  21: 1,
  [highestBid]: 1,
};

describe("OrderBookContainer", () => {
  test("renders headers", () => {
    render(<OrderBookContainer orders={orders} />);
    const total = screen.getAllByText(/TOTAL/i);
    const size = screen.getAllByText(/SIZE/i);
    const price = screen.getAllByText(/PRICE/i);

    expect(total).toHaveLength(2);
    expect(size).toHaveLength(2);
    expect(price).toHaveLength(2);
  });
  test("renders asks in proper order, prices correctly formatted, proper sizes and totals", () => {
    render(<OrderBookContainer orders={orders} />);
    const orderBookRows = screen.getAllByTestId(/order-book-row/i);
    const { 2: first, 5: last } = orderBookRows;

    expect(first.textContent).toEqual("1.5022");
    expect(last.textContent).toEqual("7.50310");
  });
  test("renders proper parts of bids with prices formatted, proper sizes and totals", () => {
    render(<OrderBookContainer orders={{ asks: {}, bids }} />);
    const orderBookRows = screen.getAllByTestId(/order-book-row/i);
    const { 1: first, [orderBookRows.length - 2]: last } = orderBookRows;

    expect(first.textContent).toEqual("22.0011");
    expect(last.textContent).toEqual("3.00120");
  });
  test("renders spread header and count spread corectly", () => {
    render(<OrderBookContainer orders={{ ...orders, bids }} />);
    const orderBookSpread = screen.getByText(/Spread/i);

    const spread = lowestAsk - highestBid;
    const precetageSpread = ((spread / (lowestAsk + highestBid)) * 100).toFixed(
      2
    );

    expect(orderBookSpread).toBeInTheDocument();
    expect(orderBookSpread.textContent).toMatch(`${spread}`);
    expect(orderBookSpread.textContent).toMatch(`${precetageSpread}%`);
  });
});
