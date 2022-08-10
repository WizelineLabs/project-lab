import type {
  LoaderFunction,
} from "@remix-run/node";
import {   redirect } from "@remix-run/server-runtime";

export const loader: LoaderFunction = async ( ) => {
  return redirect("/projects");
};