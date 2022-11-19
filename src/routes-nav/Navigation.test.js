import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { UserProvider } from "../testUtils";
import Navigation from "./Navigation";

it("renders without crashing", function () {
  render(
      <MemoryRouter>
        <UserProvider>
          <Navigation />
        </UserProvider>
      </MemoryRouter>
  );
});

it("matches snapshot", function() {
  const { asFragment } = render(
      <MemoryRouter>
        <UserProvider>
          <Navigation />
        </UserProvider>
      </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when logged out", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <UserProvider currentUser={null}>
          <Navigation />
        </UserProvider>
      </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
