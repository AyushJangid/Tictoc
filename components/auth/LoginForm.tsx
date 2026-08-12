"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LoginSchema } from "@/lib/validations/loginSchema";

interface LoginFormProps {
  register: UseFormRegister<LoginSchema>;
  errors: FieldErrors<LoginSchema>;
  isLoading: boolean;
  authError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({
  register,
  errors,
  isLoading,
  authError,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-10 py-16 sm:px-16 md:w-1/2 lg:px-24 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">
            Welcome back
          </h1>

          {authError && (
            <div
              role="alert"
              className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {authError}
            </div>
          )}

          <form onSubmit={onSubmit} noValidate aria-label="Login form">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  aria-invalid={errors.email ? "true" : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={[
                    "w-full rounded border px-3 py-2 text-sm text-gray-900 outline-none",
                    "placeholder:text-gray-400",
                    "transition-colors",
                    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                    errors.email
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white",
                  ].join(" ")}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  aria-invalid={errors.password ? "true" : undefined}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={[
                    "w-full rounded border px-3 py-2 text-sm text-gray-900 outline-none",
                    "placeholder:text-gray-400",
                    "transition-colors",
                    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                    errors.password
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white",
                  ].join(" ")}
                  {...register("password")}
                />
                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="text-xs text-red-600"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={[
                  "w-full rounded py-2.5 text-sm font-medium text-white",
                  "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
                  "transition-colors duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                  "flex items-center justify-center gap-2",
                ].join(" ")}
              >
                {isLoading && (
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 flex-col justify-center px-16 lg:px-24 bg-blue-600">
        <div className="max-w-md">
          <h2 className="mb-6 text-4xl font-light text-white tracking-tight">
            ticktock
          </h2>
          <p className="text-base leading-relaxed text-blue-100">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any
            internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
}
