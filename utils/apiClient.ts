import { tokenStorage } from "@/utils/token";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function apiClient(
  endpoint: string,
  options: RequestInit = {},
  language?: string
) {
  const headers = new Headers(options.headers);

  const isFormData = options.body instanceof FormData;

  // Only set JSON content-type when needed
  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  }

  // Token handling
  const token = tokenStorage.getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Safe language handling (SSR-safe)
  let lang = language || "en";
  if (typeof window !== "undefined") {
    lang = localStorage.getItem("lang") || lang;
  }
  headers.set("Accept-Language", lang);

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error: any) {
    throw new Error(error?.message || "Network error");
  }

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  const message =
    data?.message || response.statusText || "Something went wrong";

  const meta = data?.meta ?? null;

  if (!response.ok) {
    const error: any = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return {
    status: response.status,
    message,
    data: data?.data ?? data,
    meta,
  };
}