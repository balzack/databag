import { checkResponse, fetchWithTimeout } from "./fetchUtil";
import { encode } from "./base64";

export async function addAccount(node: string, secure: boolean, username: string, password: string, token: string | null): Promise<void> {
  const access = token ? `?token=${token}` : "";
  const endpoint = `http${secure ? "s" : ""}://${node}/account/profile${access}`;
  const auth = encode(`${username}:${password}`);
  const headers = new Headers();
  headers.append("Credentials", `Basic ${auth}`);
  const { status } = await fetchWithTimeout(endpoint, { method: "POST", headers }, 60000);
  checkResponse(status);
}
