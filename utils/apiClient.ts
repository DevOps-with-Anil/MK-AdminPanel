
import { tokenStorage } from "@/utils/token";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/";

    
console.log(BASE_URL + "   Base url. ")
/**
 * Generic API client
 * @param endpoint API endpoint
 * @param options Fetch options
 * @param language Optional language header (e.g., 'en', 'fr')
 */
export async function apiClient(
  endpoint: string,
  options: RequestInit = {},
  language?: string
) {
  const headers = new Headers(options.headers);

  // Default JSON content type
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Set Authorization header with Bearer token
  const token = tokenStorage.get();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set language header if provided
  // if (language && !headers.has("Accept-Language")) {
    headers.set("Accept-Language", localStorage.getItem('lang') || 'en');
  // }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error: any) {
    throw {
      status: 0,
      message: error?.message || "Network error",
    };
  }

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null; // Non-JSON response
  }

  const message = data?.message || response.statusText || "Something went wrong";

  if (!response.ok) {
    throw {
      status: response.status,
      message,
      data,
    };
  }

  return {
    status: response.status,
    message,
    data: data?.data ?? data,
    meta: data?.meta,
  };
}