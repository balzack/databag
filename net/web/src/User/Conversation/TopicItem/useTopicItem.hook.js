import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../../../AppContext/AppContext';
import { ConversationContext } from '../../../ConversationContext/ConversationContext';

export function useTopicItem() {

  const [state, setState] = useState({});

  const app = useContext(AppContext);
  const conversation = useContext(ConversationContext);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
  };

  return { state, actions };
}
