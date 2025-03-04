export function getMemberImageUrl(server: string, secure: boolean, token: string, accountId: number, revision: number) {
  return `http${secure ? 's' : ''}://${server}/admin/accounts/${accountId}/image?token=${token}&revision=${revision}`;
}

