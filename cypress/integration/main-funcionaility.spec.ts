/// <reference types="cypress" />

describe("OrderBookApp", () => {
  it("should render loading message and order book header", () => {
    cy.visit("/");
    cy.contains("Loading...");
    cy.contains("Order Book");
  });
  it("should render orders after while", () => {
    cy.visit("/");
    cy.get("[data-testid=order-book-row]").should("have.length.at.least", 3);
  });
  it("should let toogle between products", () => {
    cy.visit("/");
    cy.contains("Loading...");
    cy.get("[data-testid=order-book-row]").should("have.length.at.least", 3);
    cy.get("[data-testid=toogle-products]").click();
    cy.contains("Loading...");
    cy.get("[data-testid=order-book-row]").should("have.length.at.least", 3);
  });
  it("should show message on blur, and reconnect after click", () => {
    cy.visit("/");
    cy.get("[data-testid=order-book-row]").should("have.length.at.least", 3);
    cy.window().blur();
    cy.contains("Hey, just confirm, that You are still with us!");
    cy.get("button").contains("Reconnect").click();
    cy.get("[data-testid=order-book-row]").should("have.length.at.least", 3);
  });
});
