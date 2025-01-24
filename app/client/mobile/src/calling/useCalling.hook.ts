import { useState, useContext, useEffect } from 'react'
import { DisplayContext } from '../context/DisplayContext';
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'

export function useCalling() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    strings: {}, 
    ringing: [],
    cards: [],
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const { strings } = display.state;
    updateState({ strings });
  }, [display.state]);

  useEffect(() => {
    if (app.state.session) {
      const setRinging = (ringing: { cardId: string, callId: string }[]) => {
        updateState({ ringing });
      }
      const setContacts = (cards: Card[]) => {
        updateState({ cards });
      }
      const ring = app.state.session.getRing();
      ring.addRingingListener(setRinging);
      const contact = app.state.session.getContact();
      contact.addCardListener(setContacts);
      return () => {
        ring.removeRingingListener(setRinging);
        contact.removeCardListener(setContacts);
      }
    }
  }, [app.state.session]);

  const actions = {
    call: async (cardId: string) => {
      const contact = app.state.session.getContact();
      const link = await contact.callCard(cardId);
      console.log(link);
    },
  }

  return { state, actions }
}
