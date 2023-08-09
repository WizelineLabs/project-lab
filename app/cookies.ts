import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const hasCheckMembership = createCookie("checkMembership", {
  maxAge: 604800016.56 * 3, //a month
  path: "/",
  
});