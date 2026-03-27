
import { tokenStorage } from "@/utils/token";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
console.log("Base url   :   " + BASE_URL)
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

  headers.set("Content-Type", "application/json");
  const token = tokenStorage.get();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept-Language", localStorage.getItem('lang') || 'en');
  
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
    data = null;
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
  };
}