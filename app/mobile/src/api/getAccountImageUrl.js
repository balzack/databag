export function getAccountImageUrl(server, token, accountId) {
  return `https://${server}/admin/accounts/${accountId}/image?token=${token}`
}

