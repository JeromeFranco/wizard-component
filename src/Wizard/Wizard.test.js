import React from "react";
import { render, fireEvent, cleanup } from "react-testing-library";
import "jest-dom/extend-expect";
import Wizard from "./";

const dummyFormValues = {
  firstName: "John",
  lastName: "Doe",
  emailAddress: "john@doe.com",
  age: 40,
};
const handleFinish = jest.fn();

const renderWizard = () =>
  render(
    <Wizard onFinish={handleFinish}>
      <Wizard.StepForm title="First Step">
        <Wizard.Field type="text" name="firstName" label="First name" required />
        <Wizard.Field type="text" name="lastName" label="Last name" required />
      </Wizard.StepForm>
      <Wizard.StepForm title="Second Step">
        <Wizard.Field type="email" name="emailAddress" label="Email" required />
      </Wizard.StepForm>
      <Wizard.StepForm title="Last Step">
        <Wizard.Field type="number" name="age" label="Age" required />
      </Wizard.StepForm>
    </Wizard>,
  );

const completeStep = (getByLabelText, getByTestId, stepNumber) => {
  switch (stepNumber) {
    case 1:
      {
        const firstName = getByLabelText("First name");
        const lastName = getByLabelText("Last name");
        fireEvent.change(firstName, { target: { value: dummyFormValues.firstName } });
        fireEvent.change(lastName, { target: { value: dummyFormValues.lastName } });

        const form = getByTestId("step-1").querySelector("form");
        fireEvent.submit(form);
      }
      break;
    case 2:
      {
        const emailAddress = getByLabelText("Email");
        fireEvent.change(emailAddress, { target: { value: dummyFormValues.emailAddress } });

        const form = getByTestId("step-2").querySelector("form");
        fireEvent.submit(form);
      }
      break;
    case 3:
      {
        const age = getByLabelText("Age");
        fireEvent.change(age, { target: { value: dummyFormValues.age } });

        const form = getByTestId("step-3").querySelector("form");
        fireEvent.submit(form);
      }
      break;

    default:
      break;
  }
};

afterEach(cleanup);

it("Back should not be shown on first step", () => {
  const { queryByText, getByTestId } = renderWizard();
  expect(queryByText("Back")).not.toBeInTheDocument();

  const form = getByTestId("step-1").querySelector("form");
  fireEvent.submit(form);

  expect(queryByText("Next")).toBeInTheDocument();
});

it("Clicking Next should not navigate to the next step when form is invalid", () => {
  const { getByTestId } = renderWizard();

  const form = getByTestId("step-1").querySelector("form");
  fireEvent.submit(form);

  expect(getByTestId("step-2").style.display).toBe("none");
});

it("Clicking Next should navigate to the next step when form is valid", () => {
  const { getByLabelText, getByText, getByTestId } = renderWizard();

  completeStep(getByLabelText, getByTestId, 1);

  expect(getByTestId("step-1").style.display).toBe("none");

  expect(getByText("Back")).toBeInTheDocument();
});

it("Clicking Back should move to previous step", () => {
  const { getByLabelText, getByText, getByTestId } = renderWizard();

  completeStep(getByLabelText, getByTestId, 1);

  const backButton = getByText("Back");
  fireEvent.click(backButton);

  expect(getByTestId("step-1").style.display).toBe("");
});

it("Finish should be shown on the last step and Next should not be shown", () => {
  const { getByLabelText, getByTestId, queryByText } = renderWizard();

  completeStep(getByLabelText, getByTestId, 1);
  completeStep(getByLabelText, getByTestId, 2);

  expect(getByTestId("step-3").style.display).toBe("");
  expect(queryByText("Finish")).toBeInTheDocument();
  expect(queryByText("Back")).toBeInTheDocument();
  expect(queryByText("Next")).not.toBeInTheDocument();
});

it("Clicking Finish with incorrect form values should not call onFinish", () => {
  const { getByLabelText, getByTestId } = renderWizard();

  completeStep(getByLabelText, getByTestId, 1);
  completeStep(getByLabelText, getByTestId, 2);

  expect(handleFinish).not.toHaveBeenCalled();
});

it("Clicking Finish with correct form values should call onFinish with form values as param", () => {
  const { getByLabelText, getByTestId } = renderWizard();

  completeStep(getByLabelText, getByTestId, 1);
  completeStep(getByLabelText, getByTestId, 2);
  completeStep(getByLabelText, getByTestId, 3);

  expect(handleFinish).toHaveBeenCalled();

  const accumulatedValues = { ...dummyFormValues, age: dummyFormValues.age + "" };
  expect(handleFinish).toHaveBeenCalledWith(accumulatedValues);
});

it("Wizard and StepForm should only accept valid children", () => {
  const { queryByTestId } = render(
    <Wizard onFinish={handleFinish}>
      <div data-testid="invalid-wizard-child">Invalid</div>
      <Wizard.StepForm title="First Step">
        <div data-testid="invalid-stepform-child">Invalid</div>
        <Wizard.Field type="text" name="firstName" label="First name" required />
      </Wizard.StepForm>
    </Wizard>,
  );

  expect(queryByTestId("invalid-wizard-child")).not.toBeInTheDocument();
  expect(queryByTestId("invalid-stepform-child")).not.toBeInTheDocument();
});
