import axios from 'redaxios';

export async function setProfileImage(node: string, secure: boolean, token: string, image: string) {
  const endpoint = `http${secure ? 's' : ''}://${node}/profile/image?agent=${token}`;
  const response = await axios.put(endpoint, JSON.stringify(image));
  if (response.status >= 400 && response.status < 600) {
    throw new Error('setProfileImage failed');
  }
}

