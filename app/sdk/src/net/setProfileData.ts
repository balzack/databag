import axios from 'redaxios';

export async function setProfileData(node: string, secure: boolean, token: string, name: string, location: string, description: string): Promise<void> {
  const data = { name: name, location: location, description: description };
  const endpoint = `http${secure ? 's' : ''}://${node}/profile/data?agent=${token}`;
  const response = await axios.put(endpoint, data);
  if (response.status >= 400 && response.status < 600) {
    throw new Error('setProfileData failed');
  }
}

