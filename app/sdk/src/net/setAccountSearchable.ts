import { checkResponse, fetchWithTimeout } from "./fetchUtil";

export async function setAccountSearchable(node: string, secure: boolean, token: string, flag: boolean) {
  const endpoint = `http${secure ? "s" : ""}://${node}/account/searchable?agent=${token}`;
  const { status } = await fetchWithTimeout(endpoint, {
    method: "PUT",
    body: JSON.stringify(flag),
  });
  checkResponse(status);
}
