// const IS_LOGIN = "r_login";
// const ROLE_KEY = "r_roleType";

// export const tokenStorage = {
//   set(isLogged: boolean, roleType: string) {
//     const expires = new Date();
//     expires.setHours(expires.getHours() + 5);
//     const isProd = process.env.NODE_ENV === "production";
//     const cookieOptions = `path=/; expires=${expires.toUTCString()}; SameSite=Strict;${isProd ? " Secure;" : ""}`;
//     document.cookie = `${IS_LOGIN}=${isLogged}; ${cookieOptions}`;
//     document.cookie = `${ROLE_KEY}=${roleType}; ${cookieOptions}`;
//   },

//   getLoginStatus(): boolean {
//     if (typeof document === "undefined") return false;

//     const match = document.cookie.match(
//       new RegExp("(^| )" + IS_LOGIN + "=([^;]+)")
//     );

//     return match ? match[2] === "true" : false;
//   },

//   getRole(): "ROOT" | null {
//     if (typeof document === "undefined") return null;

//     const match = document.cookie.match(
//       new RegExp("(^| )" + ROLE_KEY + "=([^;]+)")
//     );

//     return match ? (match[2] as "ROOT") : null;
//   },

//   clear() {
//     const clearOptions = "path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict;";
//     document.cookie = `${IS_LOGIN}=; ${clearOptions}`;
//     document.cookie = `${ROLE_KEY}=; ${clearOptions}`;
//   },
// };