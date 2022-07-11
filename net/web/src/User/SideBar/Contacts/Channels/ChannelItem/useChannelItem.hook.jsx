import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from 'context/StoreContext';

export function useChannelItem(item) {

  const [state, setState] = useState({
    updated: false,
  });

  const store = useContext(StoreContext);

  useEffect(() => {
    let key = `${item.id}::${item.cardId}`;
    if (store.state[key] == item.revision) {
      updateState({ updated: false });
    }
    else {
      updateState({ updated: true });
    }
  }, [store]);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const navigate = useNavigate();

  const actions = {
    select: (item) => {
      if (item.guid) {
        navigate(`/user/conversation/${item.cardId}/${item.id}`);
      }
      else {
        navigate(`/user/conversation/${item.id}`);
      }
    },
  };

  return { state, actions };
}

