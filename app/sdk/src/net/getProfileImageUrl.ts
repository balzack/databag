export function getProfileImageUrl(node: string, secure: boolean, token: string, revision: number) {
  return `http${secure ? "s" : ""}://${node}/profile/image?agent=${token}&revision=${revision}`;
}
