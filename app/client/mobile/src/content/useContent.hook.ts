import {useState, useContext, useEffect} from 'react';
import {AppContext} from '../context/AppContext';
import {DisplayContext} from '../context/DisplayContext';
import {ContextType} from '../context/ContextType';
import {Channel} from 'databag-client-sdk';

export function useContent() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    strings: display.state.strings,
    cards: [] as Card[],
    filtered: [] as Card[],
    filter: '',
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const content = app.state.session?.getContent();
    const setChannels = ({channels, cardId}) => {
      console.log("----> CHANNELS:", cardId, channels.length);
      updateState({channels});
    };
    content.addChannelListener(setChannels);
    return () => {
      content.removeChannelListener(setChannels);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = {};

  return { state, actions };
}

