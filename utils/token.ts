const TOKEN_KEY = "mk_token";

export const tokenStorage = {
  // Save token in cookie
  set(token: string) {
    const expires = new Date();
    // expires.setMinutes(expires.getMinutes() + 2); // 5 minutes
    expires.setHours(expires.getHours() + 5); // 1 hour

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