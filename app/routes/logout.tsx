import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigate, useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import { clearCookie } from "~/sessions.server";
import { useSupabaseContext } from "~/utils/supabase-client";

export async function loader({ request }: LoaderArgs) {
  return clearCookie(request);
}

export async function action({}) {
  return redirect("/");
}

export default function Logout() {
  const submit = useSubmit();
  const { supabase } = useSupabaseContext();

  useEffect(() => {
    const logoutUser = async () => {
      await supabase.auth.signOut();
      submit(null, { method: "post" });
    };

    logoutUser();
  }, []);

  return null;
}
