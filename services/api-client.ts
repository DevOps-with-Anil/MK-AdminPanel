// import { tokenStorage } from "@/utils/token";

// // Base API URL from environment variables
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// // Generic API client for making HTTP requests
// export async function apiClient(
//   endpoint: string,
//   options: RequestInit = {}
// ) {
//   // Ensure API base URL is defined
//   if (!BASE_URL) throw new Error("API base URL is not defined");

//   // Get auth token from cookie storage
//   const token = tokenStorage.get();
//   console.log("Token are in :  " + token);

//   // Make API request with default headers
//   const response = await fetch(`${BASE_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json", // Default content type
//       ...(token && { Authorization: `Bearer ${token}` }), // Add token if available
//       ...options.headers, // Allow custom headers override
//     },
//   });

//   // Parse JSON response
//   const data = await response.json();

//   // Throw error if request failed
//   if (!response.ok) {
//     throw new Error(data.message || "API Error");
//   }

//   // Return API response data
//   return data;
// }