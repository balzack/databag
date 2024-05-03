export function getAccountImageUrl(server, token, accountId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  return `${protocol}://${server}/admin/accounts/${accountId}/image?token=${token}`
}

