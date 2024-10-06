export function getCardImageUrl(node: string, secure: boolean, token: string, cardId: string, revision: number): string {
  return `http${secure ? 's' : ''}://${node}/contact/cards/${cardId}/profile/image?agent=${token}&revision=${revision}`
}

