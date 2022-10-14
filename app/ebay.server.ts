import EbayOauthToken from "ebay-oauth-nodejs-client";

export const ebayAuthToken = new EbayOauthToken({
  clientId: process.env.EBAY_CLIENT_ID || "",
  clientSecret: process.env.EBAY_CLIENT_SECRET || "",
  redirectUri: "Marlin_Jayaseke-MarlinJa-Rival--kjwht",
});
