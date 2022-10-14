import type { User } from "@prisma/client";
import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import { supabase } from "./superbase.server";

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

//TODO: Get these options from env
let storage = createCookieSessionStorage({
  cookie: {
    name: "APP_SESSION",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

/**
 * Create a cookie with that stores the provided `accessToken`
 * @param accessToken The user's JWT, stored in the user's session
 * @returns Response that sets cookie
 */
export async function createUserSession(accessToken: string) {
  // Get/create a cookie from the cookie store
  let session = await storage.getSession();

  //Set the accessToken property in the cookie
  session.set("accessToken", accessToken);

  // Return the response that sets the cookie in the client
  return json(null, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

/**
 * Gets a session cookie from the passed in request
 */
export function getSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

/**
 * Takes the JWT stored in the passed in session cookie and then fetches and returns the
 * appropriate user details via the supabase api if token is valid, or null otherwise.
 * @returns User for which accessToken is provided
 */
export async function getLoggedInUser(request: Request): Promise<User | null> {
  let session = await getSession(request);

  let accessToken = session.get("accessToken");
  if (!accessToken || typeof accessToken !== "string") return null;
  const { user } = await supabase.auth.api.getUser(accessToken);
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", user?.email)
    .single();
  return data;
}

/** Destroy the session cookie  */
export async function clearCookie(request: Request) {
  console.log("clearing cookie");
  let session = await storage.getSession(request.headers.get("Cookie"));
  return json("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createEbaySession({
  request,
  accessToken,
  redirectTo,
  expiresIn,
}: {
  request: Request;
  accessToken: string;
  redirectTo: string;
  expiresIn: number;
}) {
  const session = await getSession(request);
  session.set("ebayAccessToken", accessToken);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session, {
        maxAge: expiresIn, // Should be 2 hours
      }),
    },
  });
}
