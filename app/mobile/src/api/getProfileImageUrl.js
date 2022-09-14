export function getProfileImageUrl(server, token, revision) {
  return `https://${server}/profile/image?agent=${token}&revision=${revision}`;
}

