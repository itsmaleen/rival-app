import type { UserCredentials } from "@supabase/supabase-js";
import { supabase } from "~/supabase.server";
import supabaseToken from "~/utils/cookie";

// export const createUser = async (data: {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
// }) => {
//   const { user, error } = await supabase.auth.signUp({
//     email: data?.email,
//     password: data?.password,
//   });
//   const createUser = await supabase.from("users").upsert({
//     id: user?.id,
//     first_name: data?.firstName,
//     last_name: data?.lastName,
//     phone_number: data?.phoneNumber,
//   });
//   return { user: createUser, error };
// };

type LoginData = {
  email: string;
  password: string;
};

export const signInUser = async ({ email, password }: LoginData) => {
  const { data, error } = await supabase.auth.signIn({
    email,
    password,
  });
  return { data, error };
};

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
