const TOKEN_KEY = "mk_token";
const ROLE_KEY = "mk_roleType";

export const tokenStorage = {
  set(token: string, roleType: "ROOT" | "ADMIN") {
    const expires = new Date();
    expires.setHours(expires.getHours() + 5);
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = `path=/; expires=${expires.toUTCString()}; SameSite=Strict;${isProd ? " Secure;" : ""}`;
    document.cookie = `${TOKEN_KEY}=${token}; ${cookieOptions}`;
    document.cookie = `${ROLE_KEY}=${roleType}; ${cookieOptions}`;
  },

  getToken(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^| )" + TOKEN_KEY + "=([^;]+)")
    );
    return match ? match[2] : null;
  },

  getRole(): "ROOT" | "ADMIN" | null {
    if (typeof document === "undefined") return null;

    const match = document.cookie.match(
      new RegExp("(^| )" + ROLE_KEY + "=([^;]+)")
    );

    return match ? (match[2] as "ROOT" | "ADMIN") : null;
  },

  clear() {
    const clearOptions = "path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict;";

    document.cookie = `${TOKEN_KEY}=; ${clearOptions}`;
    document.cookie = `${ROLE_KEY}=; ${clearOptions}`;
  },
};