import type { ActionArgs } from "@remix-run/node";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createUserSession, clearCookie } from "~/sessions.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const authEvent = formData.get("event") as AuthChangeEvent;
  const formSession = formData.get("session");

  if (typeof formSession === "string") {
    const session = JSON.parse(formSession) as Session;
    if (authEvent === "SIGNED_IN") {
      return createUserSession(session.access_token);
    }
    if (authEvent === "SIGNED_OUT") {
      return clearCookie(request);
    }
  }
}
