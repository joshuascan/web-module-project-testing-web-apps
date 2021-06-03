import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const header = screen.getByText(/contact form/i);
  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
  expect(header).toHaveTextContent(/contact form/i);
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByLabelText(/first name/i);
  userEvent.type(firstNameInput, "1234");
  await waitFor(() => {
    const error = screen.getByTestId("error");
    expect(error).toBeInTheDocument();
  });
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);
  await waitFor(() => {
    const error = screen.getAllByTestId("error");
    expect(error.length).toBe(3);
  });
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const submitButton = screen.getByRole("button");
  userEvent.type(firstNameInput, "Joshua");
  userEvent.type(lastNameInput, "Scanlan");
  userEvent.click(submitButton);
  await waitFor(() => {
    const error = screen.getAllByTestId("error");
    expect(error.length).toBe(1);
  });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const emailInput = screen.getByLabelText(/email/i);
  userEvent.type(emailInput, "invalidEmail");
  await waitFor(() => {
    const error = screen.getByTestId("error");
    expect(error).toHaveTextContent("email must be a valid email address");
  });
});

test('renders "lastName is a required field" if a last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);
  await waitFor(() => {
    const lastNameError = screen.getByText(/lastName is a required field/i);
    expect(lastNameError).toBeInTheDocument();
  });
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);
  const firstNameInput = screen.queryByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole("button");

  userEvent.type(firstNameInput, "Joshua");
  userEvent.type(lastNameInput, "Scanlan");
  userEvent.type(emailInput, "josh@test.com");
  userEvent.click(submitButton);

  await waitFor(() => {
    const firstNameDisplay = screen.getByTestId(/firstnamedisplay/i);
    const lastNameDisplay = screen.getByTestId(/lastnamedisplay/i);
    const emailDisplay = screen.getByTestId(/emaildisplay/i);
    const messageDisplay = screen.queryByTestId(/messagedisplay/i);
    expect(firstNameDisplay).toHaveTextContent(firstNameInput.value);
    expect(lastNameDisplay).toHaveTextContent(lastNameInput.value);
    expect(emailDisplay).toHaveTextContent(emailInput.value);
    expect(messageDisplay).not.toBeInTheDocument();
  });
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const messageInput = screen.getByLabelText(/message/i);
  const submitButton = screen.getByRole("button");

  userEvent.type(firstNameInput, "Joshua");
  userEvent.type(lastNameInput, "Scanlan");
  userEvent.type(emailInput, "josh@test.com");
  userEvent.type(messageInput, "This is a test message.");
  userEvent.click(submitButton);

  await waitFor(() => {
    const firstNameDisplay = screen.getByTestId(/firstnamedisplay/i);
    const lastNameDisplay = screen.getByTestId(/lastnamedisplay/i);
    const emailDisplay = screen.getByTestId(/emaildisplay/i);
    const messageDisplay = screen.getByTestId(/messagedisplay/i);
    expect(firstNameDisplay).toHaveTextContent(firstNameInput.value);
    expect(lastNameDisplay).toHaveTextContent(lastNameInput.value);
    expect(emailDisplay).toHaveTextContent(emailInput.value);
    expect(messageDisplay).toHaveTextContent(messageInput.value);
  });
});

test("doesn't render 'You Submitted' message if empty form is submitted", async () => {
  render(<ContactForm />);
  const submitMessage = screen.queryByText(/you submitted/i);
  const submitButton = screen.getByRole("button");

  userEvent.click(submitButton);
  expect(submitMessage).not.toBeInTheDocument();
});
