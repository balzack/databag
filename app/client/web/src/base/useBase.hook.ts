import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext'
import { ContextType } from '../context/ContextType'

export function useBase() {
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    strings: display.state.strings,
    scheme: display.state.scheme,
    profileSet: null as null | boolean,
    cardSet: null as null | boolean,
    channelSet: null as null | boolean,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }
  
  useEffect(() => {
    const { strings, scheme } = display.state;
    updateState({ strings, scheme });
  }, [display.state]);

  useEffect(() => {
    const setProfile = (profile: Profile) => {
      updateState({ profileSet: Boolean(profile.name) });
    }
    const setCards = (cards: Card[]) => {
      updateState({ cardSet: cards.length > 0 });
    }
    const setChannels = ({ channels, cardId }: { channels: Channel[]; cardId: string | null }) => {
      updateState({ channelSet: channels.length > 0 });
    }

    const { identity, contact, content } = app.state.session
    identity.addProfileListener(setProfile)
    contact.addCardListener(setCards)
    content.addChannelListener(setChannels)

    return () => {
      identity.removeProfileListener(setProfile);
      contact.removeCardListener(setCards);
      content.removeChannelListener(setChannels);
    }
  }, []);

  const actions = {
  }

  return { state, actions }
}
