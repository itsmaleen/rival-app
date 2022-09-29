import type { Session } from "@supabase/supabase-js";
import { supabase } from "~/supabase.server";
import supabaseToken from "~/utils/cookie";

type LoginData = {
  email: string;
  // password: string;
};

export const signInUser = async ({ email }: LoginData) => {
  const { data, error } = await supabase.auth.signIn({
    email,
  });
  return { data, error };
};

export const setAuth = (token: string): Session => {
  return supabase.auth.setAuth(token);
};

// TODO: REMOVE THIS
const getToken = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  return await supabaseToken.parse(cookieHeader);
};
const getUserByToken = async (token: string) => {
  supabase.auth.setAuth(token);
  const { user, error } = await supabase.auth.api.getUser(token);
  return { user, error };
};
export const isAuthenticated = async (
  request: Request,
  validateAndReturnUser = false
) => {
  const token = await getToken(request);
  if (!token && !validateAndReturnUser) return false;
  if (validateAndReturnUser) {
    const { user, error } = await getUserByToken(token);
    if (error) {
      return false;
    }
    return { user };
  }
  return true;
};
export const getUserData = async (userId: Number) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single();
  return { data, error };
};
// TODO: REMOVE THIS ^
