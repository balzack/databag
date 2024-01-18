import { useContext, useState, useEffect } from 'react';
import { ChannelContext } from 'context/ChannelContext';
import { CardContext } from 'context/CardContext';
import { AccountContext } from 'context/AccountContext';
import { encryptChannelSubject } from 'context/sealUtil';

export function useAddChannel() {

  const [state, setState] = useState({
    sealable: false,
    busy: false,
    showAdd: false,
    allowUnsealed: false,
    subject: null,
    members: new Set(),
    seal: false,
  });

  const card = useContext(CardContext);
  const channel = useContext(ChannelContext);
  const account = useContext(AccountContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    const { seal, sealKey } = account.state;
    const allowUnsealed = account.state.status?.allowUnsealed;
    if (seal?.publicKey && sealKey?.public && sealKey?.private && seal.publicKey === sealKey.public) {
      updateState({ seal: false, sealable: true, allowUnsealed });
    }
    else {
      updateState({ seal: false, sealable: false, allowUnsealed });
    }
  }, [account.state]);

  const actions = {
    addChannel: async () => {
      let conversation;
      if (!state.busy) {
        try {
          updateState({ busy: true });
          const cards = Array.from(state.members.values());
          if (state.seal || !state.allowUnsealed) {
            const keys = [ account.state.sealKey.public ];
            cards.forEach(id => {
              keys.push(card.state.cards.get(id).data.cardProfile.seal);
            });
            const sealed = encryptChannelSubject(state.subject, keys);
            conversation = await channel.actions.addChannel('sealed', sealed, cards);
          }
          else {
            const subject = { subject: state.subject };
            conversation = await channel.actions.addChannel('superbasic', subject, cards);
          }
          updateState({ busy: false });
        }
        catch(err) {
          console.log(err);
          updateState({ busy: false });
          throw new Error("failed to create new channel");
        }
      }
      else {
        throw new Error("operation in progress");
      }
      return conversation.id;
    },
    setSeal: (seal) => {
      if (seal) {
        const cards = Array.from(state.members.values());
        const members = new Set(state.members);
        cards.forEach(id => {
          if (!(card.state.cards.get(id)?.data?.cardProfile?.seal)) {
            members.delete(id);
          }
        });
        updateState({ seal: true, members });
      }
      else {
        updateState({ seal: false });
      }
    },
    onMember: (string) => {
      const members = new Set(state.members);
      if (members.has(string)) {
        members.delete(string);
      }
      else {
        members.add(string);
      }
      updateState({ members });
    },
    setSubject: (subject) => {
      updateState({ subject });
    },
    cardFilter: (card) => {
      if (state.seal || !state.allowUnsealed) {
        return card?.data?.cardDetail?.status === 'connected' && card?.data?.cardProfile?.seal;
      }
      return card?.data?.cardDetail?.status === 'connected';
    },
  };

  return { state, actions };
}

