import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'
import { Card, Channel } from 'databag-client-sdk'

export function useContacts() {
  const app = useContext(AppContext) as ContextType
  const [state, setState] = useState({
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const contact = app.state.session?.getContact();
    const setCards = (cards: Card[]) => {
      console.log("CARDS", cards);
    };
    contact.addCardListener(setCards);
    const setChannels = ({ cardId, channels }: { cardId: string, channels: Channel[] }) => {
      
      console.log("CHANNELS :", cardId, channels);
    };
    contact.addChannelListener(null, setChannels);
    return () => {
      contact.removeCardListener(setCards);
      contact.removeChannelListener(setChannels);
    }
  }, [])

  const actions = {
  }

  return { state, actions }
}
