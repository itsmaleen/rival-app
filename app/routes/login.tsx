import { useOutletContext } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ContextType } from "../root";

export const loader: LoaderFunction = async ({ request }) => {
  // We can retrieve the session on the server and hand it to the client.
  // This is used to make sure the session is available immediately upon rendering
  const response = new Response();
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      request,
      response,
    }
  );
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  const user = session?.user;
  if (user) {
    return redirect("/");
  }

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the loader response
  return json({
    headers: response.headers,
  });
};

export default function Login() {
  const { supabase } = useOutletContext<ContextType>();
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {supabase && (
              <Auth
                redirectTo="http://localhost:3000"
                appearance={{ theme: ThemeSupa }}
                supabaseClient={supabase}
                providers={["google", "facebook"]}
                socialLayout="vertical"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
