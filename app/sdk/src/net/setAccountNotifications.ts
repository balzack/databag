import axios from 'redaxios';

export async function setAccountNotifications(node: string, secure: boolean, token: string, flag: boolean) {
  const endpoint = `http${secure ? 's' : ''}://${node}/account/notification?agent=${token}`;
  const response = await axios.put(endpoint, JSON.stringify(flag));
  if (response.status >= 400 && response.status < 600) {
    throw new Error('setAccountNotification failed');
  }
}

