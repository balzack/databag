export function getCardImageUrl(token, cardId, revision) {
  return `/contact/cards/${cardId}/profile/image?agent=${token}&revision=${revision}`
}

