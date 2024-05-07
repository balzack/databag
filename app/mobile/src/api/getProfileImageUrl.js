export function getProfileImageUrl(server, token, revision) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  return `${protocol}://${server}/profile/image?agent=${token}&revision=${revision}`;
}

