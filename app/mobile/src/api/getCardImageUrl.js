export function getCardImageUrl(server, token, cardId, revision) {
  return `https://${server}/contact/cards/${cardId}/profile/image?agent=${token}&revision=${revision}`
}

