import type { LoaderArgs } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { clearCookie } from "~/sessions.server";
import { useSupabaseContext } from "~/utils/supabase-client";

export async function loader({ request }: LoaderArgs) {
  return clearCookie(request);
}

export default function Logout() {
  const navigate = useNavigate();
  const { supabase } = useSupabaseContext();

  useEffect(() => {
    const logoutUser = async () => {
      await supabase.auth.signOut();
      navigate("/");
    };

    logoutUser();
  }, []);

  return null;
}
