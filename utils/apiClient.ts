const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
) {
  const headers = new Headers(options.headers);

  // Default JSON header
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error: any) {
    // 🌐 Network error (no response)
    throw {
      status: 0,
      message: error.message || "Network error",
    };
  }

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null; // Non-JSON response
  }

  const message =
    data?.message ||
    response.statusText ||
    "Something went wrong";

  // ❌ ERROR → throw (goes to catch in UI)
  if (!response.ok) {
    throw {
      status: response.status,
      message,
      data,
    };
  }

  // ✅ SUCCESS → return to UI
  return {
    status: response.status,         // 200 / 201
    message,                         // API message
    data: data?.data ?? data,        // actual payload
  };
}