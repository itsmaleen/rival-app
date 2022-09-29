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
import { useEffect } from "react";
import Navbar from "~/components/navbar";
import styles from "./styles/app.css";
import * as gtag from "./utils/gtag.client";
import { createClient } from "@supabase/supabase-js";
import { SupabaseProvider } from "./utils/supabase-client";
import { getLoggedInUser } from "./sessions.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Collectibles made social",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const isMobileView = (
    request ? request.headers.get("user-agent") : navigator.userAgent
  ).match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i);

  const user = await getLoggedInUser(request);

  //Returning the isMobileView as a prop to the component for further use.
  return json({
    supabaseKey: process.env.SUPABASE_ANON_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
    isMobileView: Boolean(isMobileView),
    gaTrackingId: process.env.GA_TRACKING_ID,
    user,
  });
};

export default function App() {
  const { isMobileView, gaTrackingId, supabaseKey, supabaseUrl, user } =
    useLoaderData();
  const location = useLocation();

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(user);

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

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
        <SupabaseProvider supabase={supabase}>
          <>
            <Navbar isMobileView={isMobileView} />
            <Outlet />
          </>
        </SupabaseProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
