import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = BASE + "/api";

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "user" | "admin";
}

interface AuthState {
  isAuthenticated: boolean;
  user?: AuthUser;
}

async function fetchAuthUser(): Promise<AuthState> {
  const res = await fetch(`${API}/auth/user`, { credentials: "include" });
  if (!res.ok) return { isAuthenticated: false };
  return res.json();
}

async function apiLogin(email: string, password: string): Promise<AuthState> {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao fazer login");
  return data;
}

async function apiRegister(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
): Promise<AuthState> {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao criar conta");
  return data;
}

async function apiLogout(): Promise<void> {
  await fetch(`${API}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<AuthState>({
    queryKey: ["auth"],
    queryFn: fetchAuthUser,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiLogin(email, password),
    onSuccess: (result) => {
      queryClient.setQueryData(["auth"], result);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => apiRegister(email, password, firstName, lastName),
    onSuccess: (result) => {
      queryClient.setQueryData(["auth"], result);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      queryClient.setQueryData(["auth"], { isAuthenticated: false });
      queryClient.invalidateQueries();
    },
  });

  return {
    isLoading,
    isAuthenticated: data?.isAuthenticated ?? false,
    user: data?.user,
    login: (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),
    register: (
      email: string,
      password: string,
      firstName?: string,
      lastName?: string,
    ) => registerMutation.mutateAsync({ email, password, firstName, lastName }),
    logout: () => logoutMutation.mutate(),
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
