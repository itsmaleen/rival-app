import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getScopes } from "~/utils/ebay";
import { ebayAuthToken } from "~/ebay.server";

export async function loader() {
  const scopes = getScopes();
  const authUrl = ebayAuthToken.generateUserAuthorizationUrl(
    "PRODUCTION",
    scopes
  );

  return json({ authUrl });
}

export default function Ebay() {
  const data = useLoaderData<typeof loader>();

  return (
    <a href={data.authUrl} target="_blank" rel="noreferrer">
      Connect w/ ebay
    </a>
  );
}
