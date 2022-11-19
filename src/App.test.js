import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";


// smoke tests
it("renders without crashing", function() {
  render(<App />);
  const linkElement = screen.getAllByText("Footy");
  expect(linkElement[0]).toBeInTheDocument();
});


// snapshot tests
it("matches snapshot", function() {
  const { asFragment } = render(<App />);
  expect(asFragment()).toMatchSnapshot();
});
