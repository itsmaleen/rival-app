import type { LoaderArgs } from "@remix-run/node";
import { getRefreshToken, saveRefreshToken } from "~/models/ebay.server";
import { createEbaySession, getLoggedInUser } from "~/sessions.server";
import { ebayAuthToken } from "~/ebay.server";
import { getScopes } from "~/utils/ebay";

export async function loader({ request }: LoaderArgs) {
  // const user = await getLoggedInUser(request);
  // if (!user) {
  //   return redirect("/login");
  // }

  const previousRefreshToken = await getRefreshToken(1);

  let accessToken = "";
  let expiresIn = 0; // 2 hours

  if (
    previousRefreshToken === null ||
    previousRefreshToken.expiresAt < new Date()
  ) {
    const url = new URL(request.url);
    const authorizationCode = url.searchParams.get("code") || "";

    console.log(authorizationCode);
    // const scopes = getScopes();
    const exchangeCodeString = await ebayAuthToken.exchangeCodeForAccessToken(
      "PRODUCTION",
      authorizationCode
    );

    const exchangeJson = JSON.parse(exchangeCodeString);
    accessToken = exchangeJson.access_token;
    const refreshToken = exchangeJson.refresh_token;
    const refreshTokenExpiresIn = Number(exchangeJson.refresh_token_expires_in);
    expiresIn = Number(exchangeJson.expires_in);

    await saveRefreshToken(1, refreshToken, refreshTokenExpiresIn);
  } else {
    // Using a refresh token to update a User access token (Updating the expired access token).
    const getAccessTokenString = await ebayAuthToken.getAccessToken(
      "PRODUCTION",
      previousRefreshToken.token,
      getScopes()
    );
    const getAccessTokenJson = JSON.parse(getAccessTokenString);
    accessToken = getAccessTokenJson.access_token;
    expiresIn = Number(getAccessTokenJson.expires_in);
  }

  return createEbaySession({
    request,
    accessToken,
    redirectTo: "/",
    expiresIn,
  });
}
