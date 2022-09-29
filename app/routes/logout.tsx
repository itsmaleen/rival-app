import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { clearCookie } from "~/sessions.server";

export const action: ActionFunction = async ({ request }) => {
  return clearCookie(request);
};

export let loader: LoaderFunction = async ({ request }) => {
  return redirect("/");
};
