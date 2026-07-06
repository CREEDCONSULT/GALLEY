"use server";

import { revalidatePath } from "next/cache";
import { createClientWithPlaybook, isBackendConfigured } from "@/lib/galley/convexData";

function parseList(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function saveOnboardingData(data: {
  client_name: string;
  website: string;
  industry: string;
  target_audience: string;
  primary_offer: string;
  channels: string[];
  brand_voice: string;
  approved_claims: string;
  forbidden_claims: string;
  reporting_kpi: string;
}): Promise<{ success?: true; error?: string; version?: number }> {
  if (!isBackendConfigured()) {
    return { error: "The Convex backend is not configured." };
  }
  try {
    const result = await createClientWithPlaybook({
      name: data.client_name,
      website: data.website,
      industry: data.industry,
      targetAudience: data.target_audience,
      primaryOffer: data.primary_offer,
      voice: data.brand_voice,
      approvedClaims: parseList(data.approved_claims),
      forbiddenClaims: parseList(data.forbidden_claims),
      channels: data.channels,
      reportingKpi: data.reporting_kpi,
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/proof");
    return { success: true, version: result.version };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "We could not save this playbook.",
    };
  }
}
