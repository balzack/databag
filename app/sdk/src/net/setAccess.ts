import axios from 'redaxios';
import { encode } from './base64';

export async function setAccess(url: string, token: string, appName: string, appVersion: string, platform: string, deviceToken: string, pushType: string, notifications: { event: string, messageTitle: string }[]): Promise<{ guid: string, appToken: string, created: number, pushSupported: boolean }> {
  const endpoint = `${url}/account/access?token=${token}&appName=${appName}&appVersion=${appVersion}&platform=${platform}&deviceToken=${deviceToken}&pushType=${pushType}`
  const response = await axios.put(endpoint, notifications)
  if (response.status >= 400 && response.status < 600) {
    throw new Error('setAccess failed')
  }
  return response.data;
}

