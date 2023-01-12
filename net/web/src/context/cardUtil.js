export function getCardByGuid(cards, guid) {
  let card = null;
  cards.forEach((value, key, map) => {
    if(value?.data?.cardProfile?.guid === guid) {
      card = value;
    }
  });
  return card;
}

export function getProfileByGuid(cards, guid) {
  const card = getCardByGuid(cards, guid);
  if (card?.data?.cardProfile) {
    const { name, handle, imageSet } = card.data.cardProfile;
    const cardId = card.id;
    return { cardId, name, handle, imageSet }
  }
  return {};
}

