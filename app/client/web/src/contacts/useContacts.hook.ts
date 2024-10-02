import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'
import { Card } from 'databag-client-sdk'

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
    return () => {
      contact.removeCardListener(setCards);
    }
  }, [])

  const actions = {
  }

  return { state, actions }
}
