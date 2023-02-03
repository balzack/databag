import { useState, useContext, useEffect, useRef } from 'react';
import { ViewportContext } from 'context/ViewportContext';
import { ConversationContext } from 'context/ConversationContext';
import { CardContext } from 'context/CardContext';
import { ProfileContext } from 'context/ProfileContext';
import { getCardByGuid } from 'context/cardUtil';
import { decryptChannelSubject } from 'context/sealUtil';

export function useChannelHeader(contentKey) {

  const [state, setState] = useState({
    logoImg: null,
    logoUrl: null,
    label: null,
    title: null,
    offsync: false,
    display: null,
  });

  const viewport = useContext(ViewportContext);
  const card = useContext(CardContext);
  const conversation = useContext(ConversationContext);
  const profile = useContext(ProfileContext);
  
  const cardId = useRef();
  const channelId = useRef();
  const detailRevision = useRef();
  const key = useRef();

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport.state]);

  useEffect(() => {

    const cardValue = conversation.state.card;
    const channelValue = conversation.state.channel;

    // extract member info
    let memberCount = 0;
    let names = [];
    let img = null;
    let logo = null;
    if (cardValue) {
      const profile = cardValue.data?.cardProfile;
      if (profile?.name) {
        names.push(profile.name);
      }
      if (profile?.imageSet) {
        img = null;
        logo = card.actions.getCardImageUrl(cardValue.id);
      }
      else {
        img = 'avatar';
        logo = null;
      }
      memberCount++;
    }
    if (channelValue?.data?.channelDetail?.members) {
      for (let guid of channelValue.data.channelDetail.members) {
        if (guid !== profile.state.identity.guid) {
          const contact = getCardByGuid(card.state.cards, guid);
          const profile = contact?.data?.cardProfile;
          if (profile?.name) {
            names.push(profile.name);
          }
          if (profile?.imageSet) {
            img = null;
            logo = card.actions.getCardImageUrl(contact.id);
          }
          else {
            img = 'avatar';
            logo = null;
          }
          memberCount++;
        }
      }
    }

    let label;
    if (memberCount === 0) {
      img = 'solution';
      label = 'Notes';
    }
    else if (memberCount === 1) {
      label = names.join(',');
    }
    else {
      img = 'appstore';
      label = names.join(',');
    }

    if (cardId.current !== cardValue?.id || channelId.current !== channelValue?.id ||
        detailRevision.current !== channelValue?.data?.detailRevision || key.current !== contentKey) {
      let title;
      try {
        const detail = channelValue?.data?.channelDetail;
        if (detail?.dataType === 'sealed') {
          if (contentKey) {
            const unsealed = decryptChannelSubject(detail.data, contentKey);
            title = unsealed.subject;
          }
          else {
            title = '...';
          }
        }
        else if (detail?.dataType === 'superbasic') {
          const data = JSON.parse(detail.data);
          title = data.subject;
        }
      }
      catch(err) {
        console.log(err);
      }
      cardId.current = cardValue?.id;
      channelId.current = channelValue?.id;
      detailRevision.current = channelValue?.data?.detailRevision;
      key.current = contentKey;
      updateState({ title, label, img, logo });
    }
    else {
      updateState({ label, img, logo });
    }
    // eslint-disable-next-line
  }, [conversation.state, card.state, contentKey]);

  const actions = {
    resync: () => {
    },
  };

  return { state, actions };
}
