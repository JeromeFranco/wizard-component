import React from "react";
import { render } from "react-testing-library";
import { get } from "./api";
import App from "./App";

jest.mock("./api", () => {
  return {
    get: jest.fn(),
  };
});

it("fetch from employees api on load", () => {
  render(<App />);
  expect(get).toBeCalledTimes(1);
  expect(get).toBeCalledWith("http://localhost:4000/employees");
});
