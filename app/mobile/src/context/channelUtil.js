import { getCardByGuid } from 'context/cardUtil';

export function getChannelSubjectLogo(cardId, profileGuid, channel, cards, cardImageUrl, strings) {

  let subject;
  try {
    if (channel?.detail?.dataType === 'sealed') {
      subject = channel?.unsealedDetail?.subject;
    }
    if (channel?.detail?.dataType === 'superbasic') {
      subject = JSON.parse(channel.detail.data)?.subject;
    }
  }
  catch(err) {
    console.log(err);
  }

  const contacts = [];
  if (cardId) {
    const contact = cards.get(cardId)?.card;
    contacts.push(contact);
  }
  if (channel?.detail?.members?.length) {
    channel.detail.members.forEach(guid => {
      if (guid !== profileGuid) {
        const contact = getCardByGuid(cards, guid)?.card;
        contacts.push(contact);
      }
    })
  }

  if (!subject) {
    if (contacts.length === 0) {
      subject = strings?.notes;
    }
    else {
      const names = [];
      contacts.forEach(contact => {
        if (contact?.profile?.name) {
          names.push(contact.profile.name);
        }
        else if (contact?.profile?.handle) {
          names.push(contact.profile.handle);
        }
      });
      subject = names.join(', ');
    }
  }

  let logo;
  if (contacts.length === 0) {
    logo = 'solution';
  }
  else if (contacts.length === 1) {
    const contact = contacts[0];
    if (contact?.profile?.imageSet) {
      logo = cardImageUrl(contact.cardId)
    }
    else {
      logo = 'avatar';
    }
  }
  else {
    logo = 'appstore';
  }

  return { logo, subject };
}
