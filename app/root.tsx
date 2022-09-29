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
import { isAuthenticated } from "./utils/auth";
import { supabase } from "./supabase.server";

import * as gtag from "./utils/gtag.client";
// import { UserProvider } from "./components/UserProvider";
import { UserContextProvider } from "./useUser";
// import { UserProvider } from "@supabase/auth-helpers-react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Collectibles made social",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

interface RootLoader {
  ENV: { [key: string]: string };
}

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const ENV = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  };
  const isMobileView: RegExpMatchArray | null = (
    request ? request.headers?.get("user-agent") : navigator?.userAgent
  ).match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i);

  //Returning the isMobileView as a prop to the component for further use.
  return json({
    ENV,
    isMobileView: Boolean(isMobileView),
    gaTrackingId: process.env.GA_TRACKING_ID,
  });
};

export default function App() {
  const { isMobileView, gaTrackingId, ENV } = useLoaderData();
  const location = useLocation();

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
        <UserContextProvider
        //  supabaseClient={supabase} callbackUrl="/auth"
        >
          <>
            <Navbar isMobileView={isMobileView} />
            <Outlet />
          </>
        </UserContextProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />

        <EnvironmentSetter env={ENV} />
      </body>
    </html>
  );
}

/**
 This component loads environment variables into window.ENV 
 */
function EnvironmentSetter({ env }: { env: { [key: string]: string } }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.ENV = ${JSON.stringify(env)}`,
      }}
    />
  );
}
