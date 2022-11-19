import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import SignupForm from "./SignupForm";

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
