import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const hasCheckMembership = createCookie("check-membership", {
//   maxAge: 604_800,
  maxAge: 604800016.56 , //a week
  path: "/",
  
});