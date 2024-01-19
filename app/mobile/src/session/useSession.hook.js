import { useRef, useState, useEffect, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import config from 'constants/Config';
import { StoreContext } from 'context/StoreContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { ChannelContext } from 'context/ChannelContext';
import { RingContext } from 'context/RingContext';
import { ProfileContext } from 'context/ProfileContext';
import { getLanguageStrings } from 'constants/Strings';
import { encryptChannelSubject } from 'context/sealUtil';

export function useSession() {

  const [state, setState] = useState({
    strings: getLanguageStrings(),
    tabbled: null,
    subWidth: '50%',
    baseWidth: '50%',
    cardId: null,
    converstaionId: null,
    firstRun: null,
    ringing: [],
    callStatus: null,
    callLogo: null,
    localStream: null,
    localVideo: false,
    localAudio: false,
    remoteStream: null,
    remoteVideo: false,
    remoteAudio: false,
  });

  const ring = useContext(RingContext);
  const account = useContext(AccountContext);
  const channel = useContext(ChannelContext);
  const card = useContext(CardContext);
  const profile = useContext(ProfileContext);
  const store = useContext(StoreContext);
  const dimensions = useWindowDimensions();
  const tabbed = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const ringing = [];
    const expired = Date.now();
    ring.state.ringing.forEach(call => {
      if (call.expires > expired && !call.status) {
        const { callId, cardId, calleeToken, iceUrl, iceUsername, icePassword } = call;
        const contact = card.state.cards.get(cardId);
        if (contact) {
          const { imageSet, name, handle, node, guid } = contact.card?.profile || {};
          const { token } = contact.card?.detail || {};
          const contactToken = `${guid}.${token}`;
          const server = node ? node : profile.state.server;
          const img = imageSet ? card.actions.getCardImageUrl(cardId) : null;
          ringing.push({ cardId, img, name, handle, contactNode: server, callId, contactToken, calleeToken, iceUrl, iceUsername, icePassword });
        }
      }
    });

    let callLogo = null;
    const contact = card.state.cards.get(ring.state.cardId);
    if (contact) {
      const { imageSet } = contact.card?.profile || {};
      callLogo = imageSet ? card.actions.getCardImageUrl(ring.state.cardId) : null;
    }

    const { callStatus, localStream, localVideo, localAudio, remoteStream, remoteVideo, remoteAudio } = ring.state;
    updateState({ ringing, callStatus, callLogo, localStream, localVideo, localAudio, remoteStream, remoteVideo, remoteAudio });
  }, [ring.state]);

  useEffect(() => {
    const { allowUnsealed } = account.state.status || {};
    const { status, sealKey } = account.state;
    if (status?.seal?.publicKey && sealKey?.public && sealKey?.private && sealKey?.public === status.seal.publicKey) {
      updateState({ sealable: true, allowUnsealed });
    }
    else {
      updateState({ sealable: false, allowUnsealed });
    }
  }, [account.state]);


  useEffect(() => {
    checkFirstRun();
  }, []);

  const checkFirstRun = async () => {
    const firstRun = await store.actions.getFirstRun();
    updateState({ firstRun });
  }

  useEffect(() => {
    if (tabbed.current !== true) {
      if (dimensions.width > config.tabbedWidth) {
        const width = Math.floor((dimensions.width * 33) / 100);
        tabbed.current = false;
        updateState({ tabbed: false, baseWidth: width + 50, subWidth: width });
      }
      else {
        tabbed.current = true;
        updateState({ tabbed: true });
      }
    }
  }, [dimensions]);

  const actions = {
    setCardId: (cardId) => {
      updateState({ cardId });
    },
    clearFirstRun: () => {
      updateState({ firstRun: false });
      store.actions.setFirstRun();
    },
    ignore: (call) => {
      ring.actions.ignore(call.cardId, call.callId);
    },
    decline: async (call) => {
      const { cardId, contactNode, contactToken, callId } = call;
      await ring.actions.decline(cardId, contactNode, contactToken, callId);
    },
    accept: async (call) => {
      const { cardId, callId, contactNode, contactToken, calleeToken, iceUrl, iceUsername, icePassword } = call;
      await ring.actions.accept(cardId, callId, contactNode, contactToken, calleeToken, iceUrl, iceUsername, icePassword);
    },
    end: async () => {
      await ring.actions.end();
    },
    enableVideo: async () => {
      await ring.actions.enableVideo();
    },
    disableVideo: async () => {
      await ring.actions.disableVideo();
    },
    enableAudio: async () => {
      await ring.actions.enableAudio();
    },
    disableAudio: async () => {
      await ring.actions.disableAudio();
    },
    setDmChannel: async (cardId) => {
      let channelId;
      channel.state.channels.forEach((entry, id) => {
        const cards = entry?.detail?.contacts?.cards || [];
        const subject = entry?.detail?.data || '';
        const type = entry?.detail?.dataType || '';
        if (cards.length == 1 && cards[0] === cardId && type === 'superbasic' && subject === '{"subject":null}') {
          channelId = entry.channelId;
        }
      });
      if (channelId != null) {
        return channelId;
      }
      if (state.sealable && !state.allowUnsealed) {
        const keys = [ account.state.sealKey.public ];
        keys.push(card.state.cards.get(cardId).card.profile.seal);
        const sealed = encryptChannelSubject(state.subject, keys);
        const conversation = await channel.actions.addChannel('sealed', sealed, [ cardId ]);
        return conversation.id;
      }
      else {
        const conversation = await channel.actions.addChannel('superbasic', { subject: null }, [ cardId ]);
        return conversation.id;
      }
    },
  };

  return { state, actions };
}


