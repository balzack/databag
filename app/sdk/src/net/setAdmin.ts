import axios from 'redaxios';

export async function setAdmin(node: string, secure: boolean, token: string, mfaCode: string | null): Promise<string> {
  const mfa = mfaCode ? `&code=${mfaCode}` : '';
  const endpoint = `http${secure ? 's' : ''}://${node}/admin/access?token=${encodeURIComponent(token)}${mfa}`
  const response = await axios.put(endpoint)
  if (response.status >= 400 && response.status < 600) {
    throw new Error('setAdmin failed')
  }
  return response.data;
}

