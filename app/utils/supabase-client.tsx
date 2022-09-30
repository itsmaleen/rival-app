import type {
  AuthChangeEvent,
  Session,
  SupabaseClient,
  User,
} from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode, FC } from "react";
import { useFetcher } from "@remix-run/react";

type UserContextType = {
  user: User | null;
  session: Session | null;
  supabase: SupabaseClient;
};

export const SupabaseContext = createContext<UserContextType | undefined>(
  undefined
);

export const SupabaseProvider: FC<{
  children: ReactNode;
  supabase: SupabaseClient;
}> = ({ children, supabase }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const fetcher = useFetcher();

  const fetchSessionCookie = (
    event: AuthChangeEvent,
    session: Session | null
  ) => {
    //We only want to create or destroy cookie when session exists and sign in/sign out occurs
    if (event === "SIGNED_IN" || event === "SIGNED_OUT")
      fetcher.submit(
        { event, session: JSON.stringify(session) },
        { action: "/auth", method: "post" }
      );
  };

  useEffect(() => {
    //If auth state changes while user is in the app, set session/auth to new values
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        fetchSessionCookie(event, session);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // On initial load, recover session from local storage and store in state
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user ?? null);

    // If session exists by now, set a cookie when app is reloaded, in case session was expired while app wasn't open
    // because session recovering/refreshing now happens on supabase constructor, before any onAuthStateChange events are emitted.
    if (session) fetchSessionCookie("SIGNED_IN", session);
  }, []);

  const value: UserContextType = { user, session, supabase };
  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

/**
 * Gets user/session/supabaseClient details stored in UserContext
 */
export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};