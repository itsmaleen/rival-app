import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";

export const loader: LoaderFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const response = new Response();

  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { error } = await supabaseClient.auth.signOut();

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the loader response
  return redirect("/", {
    headers: response.headers,
  });
};
