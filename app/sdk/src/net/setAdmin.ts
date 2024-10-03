import { checkResponse, fetchWithTimeout } from "./fetchUtil";

export async function setAdmin(
  node: string,
  secure: boolean,
  token: string,
  mfaCode: string | null,
): Promise<string> {
  const mfa = mfaCode ? `&code=${mfaCode}` : "";
  const endpoint = `http${secure ? "s" : ""}://${node}/admin/access?token=${encodeURIComponent(token)}${mfa}`;
  const admin = await fetchWithTimeout(endpoint, { method: "PUT" });
  checkResponse(admin.status);
  return await admin.json();
}
