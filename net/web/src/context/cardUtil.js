export function getCardByGuid(cards, guid) {
  let card = null;
  cards.current.forEach((value, key, map) => {
    if(value?.data?.cardProfile?.guid === guid) {
      card = value;
    }
  });
  return card;
}

export getProfileByGuid: (cards, guid) => {
  const card = getCardByGuid(guid);
  if (card?.data?.cardProfile) {
    const { name, handle, imageSet } = card.data.cardProfile;
    const revision = card.data.profileRevision;
    const cardId = card.id;
    return { cardId, revision, name, handle, imageSet, revision }
  }
  return {};
}

