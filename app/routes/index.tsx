import type {
  LoaderFunction,
} from "@remix-run/node";
import {   redirect } from "@remix-run/server-runtime";
import {
  getProjectStatuses
} from "~/models/status.server"
import { ongoingStage } from "~/constants"


export const loader: LoaderFunction = async ({ request } ) => {
  const ongoingStatuses = (await getProjectStatuses()).filter((status) => status.stage === ongoingStage);
  const url = new URL(request.url + "projects");
  ongoingStatuses.forEach((status) =>{
  url.searchParams.append("status", status.name);
  });
  return redirect(url.toString());
};