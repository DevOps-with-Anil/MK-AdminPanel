// const TOKEN_KEY = "mk_token";

// // Utility for storing auth token in cookies
// export const tokenStorage = {

//   // Save token in cookie
//   set(token: string) {
//     document.cookie = `${TOKEN_KEY}=${token}; path=/; secure; samesite=strict`;
//   },

//   // Get token from cookie
//   get(): string | null {
//     const match = document.cookie.match(
//       new RegExp("(^| )" + TOKEN_KEY + "=([^;]+)")
//     );
//     return match ? match[2] : null;
//   },

//   // Remove token cookie
//   clear() {
//     document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
//   },

// };

const TOKEN_KEY = "mk_token";

export const tokenStorage = {
  // Save token in cookie
  set(token: string) {
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour

    const isProd = process.env.NODE_ENV === "production";

    document.cookie = `${TOKEN_KEY}=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict${
      isProd ? "; Secure" : ""
    }`;
  },

  // Get token
  get(): string | null {
    if (typeof document === "undefined") return null;

    const match = document.cookie.match(
      new RegExp("(^| )" + TOKEN_KEY + "=([^;]+)")
    );

    return match ? match[2] : null;
  },

  // Remove token
  clear() {
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict`;
  },
};