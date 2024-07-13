import axios from 'redaxios';

export async function setAdmin(url: string, token: string, mfaCode: string | null): Promise<string> {
  const mfa = mfaCode ? `&code=${mfaCode}` : '';
  const endpoint = `${url}/admin/access?token=${encodeURIComponent(token)}${mfa}`


console.log("ENDPOINT: ", endpoint);

  const response = await axios.put(endpoint)
  if (response.status >= 400 && response.status < 600) {
    throw new Error('setAdmin failed')
  }
  return response.data;
}

