import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm } from "@/components/auth/LoginForm";
import { loginSchema, LoginSchema } from "@/lib/validations/loginSchema";

// Test harness that wires react-hook-form to LoginForm
function LoginFormWrapper({
  authError = null,
  isLoading = false,
}: {
  authError?: string | null;
  isLoading?: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <LoginForm
      register={register}
      errors={errors}
      isLoading={isLoading}
      authError={authError}
      onSubmit={handleSubmit(() => {})}
    />
  );
}

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    render(<LoginFormWrapper />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders the sign in button", () => {
    render(<LoginFormWrapper />);
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors when form is submitted empty", async () => {
    const user = userEvent.setup();
    render(<LoginFormWrapper />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it("shows invalid email error for wrong format", async () => {
    const user = userEvent.setup();
    render(<LoginFormWrapper />);

    await user.type(screen.getByLabelText(/email/i), "notanemail");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(/valid email/i)
    ).toBeInTheDocument();
  });

  it("displays authentication error message", () => {
    render(<LoginFormWrapper authError="Invalid email or password" />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Invalid email or password"
    );
  });

  it("disables submit button while loading", () => {
    render(<LoginFormWrapper isLoading={true} />);
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeDisabled();
  });
});
