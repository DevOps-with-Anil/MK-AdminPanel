// const TOKEN_KEY = "mk_token";

// export const tokenStorage = {
//   // Save token in cookie
//   set(token: string) {
//     const expires = new Date();
//     // expires.setMinutes(expires.getMinutes() + 2); // 5 minutes
//     expires.setHours(expires.getHours() + 5); // 1 hour

//     const isProd = process.env.NODE_ENV === "production";

//     document.cookie = `${TOKEN_KEY}=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict${
//       isProd ? "; Secure" : ""
//     }`;
//   },

//   // Get token
//   get(): string | null {
//     if (typeof document === "undefined") return null;

//     const match = document.cookie.match(
//       new RegExp("(^| )" + TOKEN_KEY + "=([^;]+)")
//     );

//     return match ? match[2] : null;
//   },

//   // Remove token
//   clear() {
//     document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict`;
//   },
// };


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