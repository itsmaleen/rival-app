import type { LoaderArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import Navbar from "~/components/navbar";
import styles from "./styles/app.css";
import * as gtag from "./utils/gtag.client";
import { hotjar } from "react-hotjar";
import {
  createBrowserClient,
  createServerClient,
} from "@supabase/auth-helpers-remix";
import type { Session, SupabaseClient } from "@supabase/auth-helpers-remix";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Collectibles made social",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export type ContextType = {
  supabase: SupabaseClient | null;
  session: Session | null;
};

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

  const isMobileView = (
    request ? request.headers.get("user-agent") : navigator.userAgent
  ).match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i);

  const response = new Response();

  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
  const {
    data: { session: initialSession },
  } = await supabaseClient.auth.getSession();
  const user = initialSession?.user;

  const { data: loggedInUserData, error } = await supabaseClient
    .from("users")
    .select()
    .eq("email", user?.email)
    .single();

  //Returning the isMobileView as a prop to the component for further use.
  return json({
    initialSession,
    env: {
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    },
    isMobileView: Boolean(isMobileView),
    gaTrackingId: process.env.GA_TRACKING_ID,
    user,
    loggedInUserData: error ? null : loggedInUserData,
    hotjarId: process.env.HOTJAR_SITE_ID,
  });
};

export default function App() {
  const {
    env,
    isMobileView,
    gaTrackingId,
    user,
    hotjarId,
    initialSession,
    loggedInUserData,
  } = useLoaderData();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(initialSession);
  const location = useLocation();

  console.log(user);
  console.log(loggedInUserData);

  const context: ContextType = { supabase, session };

  useEffect(() => {
    if (!supabase) {
      const supabaseClient = createBrowserClient(
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY
      );
      setSupabase(supabaseClient);
      const {
        data: { subscription },
      } = supabaseClient.auth.onAuthStateChange((_, session) =>
        setSession(session)
      );
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  useEffect(() => {
    hotjar.initialize(hotjarId, 6);

    if (hotjar.initialized() && user) {
      hotjar.identify("USER_EMAIL", { userProperty: user.email });
    }
  }, [hotjarId, user]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {process.env.NODE_ENV === "development" || !gaTrackingId ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        )}

        <Navbar isMobileView={isMobileView} />
        <Outlet context={context} />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
