/*
  Warnings:

  - A unique constraint covering the columns `[thirdPartyId,thirdPartyName]` on the table `third_party_collectible_identifiers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "third_party_collectible_identifiers_thirdPartyId_thirdParty_key" ON "third_party_collectible_identifiers"("thirdPartyId", "thirdPartyName");
