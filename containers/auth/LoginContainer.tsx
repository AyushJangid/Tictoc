"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm } from "@/components/auth/LoginForm";
import { loginSchema, LoginSchema } from "@/lib/validations/loginSchema";
import { signInWithCredentials } from "@/services/authService";
import { useAppDispatch } from "@/store";
import { setLoading } from "@/store/slices/authSlice";
import { APP_ROUTES } from "@/constants";

export function LoginContainer() {
  const dispatch = useAppDispatch();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginSchema) => {
    setAuthError(null);
    setIsLoading(true);
    dispatch(setLoading(true));

    const result = await signInWithCredentials({
      email: data.email,
      password: data.password,
    });

    if (result.success) {
      // Use full page navigation to ensure newly-set session cookies
      // are sent with the request (router.push does a soft navigation
      // which may not pick up the new cookies on Vercel)
      window.location.href = APP_ROUTES.DASHBOARD;
    } else {
      setAuthError(result.error ?? "Login failed. Please try again.");
      dispatch(setLoading(false));
      setIsLoading(false);
    }
  };

  return (
    <LoginForm
      register={register}
      errors={errors}
      isLoading={isLoading}
      authError={authError}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
