import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import timesheetReducer from "@/store/slices/timesheetSlice";
import { LoginContainer } from "@/containers/auth/LoginContainer";

// Mock NextAuth signIn
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

// Mock authService
jest.mock("@/services/authService", () => ({
  signInWithCredentials: jest.fn(),
}));

import { signInWithCredentials } from "@/services/authService";

const mockedSignIn = signInWithCredentials as jest.MockedFunction<
  typeof signInWithCredentials
>;

// Mock window.location.href
const originalLocation = window.location;
beforeAll(() => {
  Object.defineProperty(window, "location", {
    writable: true,
    value: { ...originalLocation, href: "" },
  });
});
afterAll(() => {
  Object.defineProperty(window, "location", {
    writable: true,
    value: originalLocation,
  });
});

function createTestStore() {
  return configureStore({
    reducer: { auth: authReducer, timesheet: timesheetReducer },
  });
}

function renderWithStore(component: React.ReactElement) {
  const store = createTestStore();
  return render(<Provider store={store}>{component}</Provider>);
}

describe("LoginContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = "";
  });

  it("renders the login form", () => {
    renderWithStore(<LoginContainer />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("redirects to dashboard on successful login", async () => {
    mockedSignIn.mockResolvedValueOnce({ success: true });
    const user = userEvent.setup();

    renderWithStore(<LoginContainer />);

    await user.type(screen.getByLabelText(/email/i), "admin@tictoc.com");
    await user.type(screen.getByLabelText(/password/i), "Admin@123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(window.location.href).toBe("/dashboard");
    });
  });

  it("shows error message on failed login", async () => {
    mockedSignIn.mockResolvedValueOnce({
      success: false,
      error: "Invalid email or password",
    });
    const user = userEvent.setup();

    renderWithStore(<LoginContainer />);

    await user.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(/invalid email or password/i)
    ).toBeInTheDocument();
  });

  it("calls signInWithCredentials with the submitted values", async () => {
    mockedSignIn.mockResolvedValueOnce({ success: true });
    const user = userEvent.setup();

    renderWithStore(<LoginContainer />);

    await user.type(screen.getByLabelText(/email/i), "admin@tictoc.com");
    await user.type(screen.getByLabelText(/password/i), "Admin@123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith({
        email: "admin@tictoc.com",
        password: "Admin@123",
      });
    });
  });
});
