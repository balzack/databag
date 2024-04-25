export function getAccountImageUrl(token, accountId) {
  return `/admin/accounts/${accountId}/image?token=${encodeURIComponent(token)}`;
}
