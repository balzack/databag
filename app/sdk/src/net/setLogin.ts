import axios from 'redaxios';
import { encode } from './base64';

export async function setLogin(node: string, secure: boolean, username: string, password: string, code: string | null, appName: string, appVersion: string, platform: string, deviceToken: string, pushType: string, notifications: { event: string, messageTitle: string}[]): Promise<{ guid: string, appToken: string, created: number, pushSupported: boolean }> {
  const mfa = code ? `&code=${code}` : '';
  const endpoint = `http${secure ? 's' : ''}://${node}/account/apps?appName=${appName}&appVersion=${appVersion}&platform=${platform}&deviceToken=${deviceToken}&pushType=${pushType}${mfa}`;
  const auth = encode(`${username}:${password}`);
  try {
    const response = await axios.post(endpoint, notifications, { auth: `Basic ${auth}` });
    return response.data;
  }
  catch(err) {
    throw new Error(err.status);
  }
}
