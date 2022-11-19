import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import LoginForm from "./LoginForm";

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
