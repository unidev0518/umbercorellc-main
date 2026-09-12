import type { MemberTier } from "@umbercore/database";

export const TIER_PRICE_ENV: Record<MemberTier, string> = {
  starter: "STRIPE_PRICE_STARTER_MONTHLY",
  pro: "STRIPE_PRICE_PRO_MONTHLY",
  insider: "STRIPE_PRICE_INSIDER_MONTHLY",
};

export function getPriceIdForTier(tier: MemberTier): string {
  const envKey = TIER_PRICE_ENV[tier];
  const priceId = process.env[envKey];
  if (!priceId) {
    throw new Error(`Missing env ${envKey} for tier ${tier}`);
  }
  return priceId;
}

export function getTierFromPriceId(priceId: string): MemberTier | null {
  const map: Record<string, MemberTier> = {};
  for (const tier of ["starter", "pro", "insider"] as MemberTier[]) {
    const id = process.env[TIER_PRICE_ENV[tier]];
    if (id) map[id] = tier;
  }
  return map[priceId] ?? null;
}
