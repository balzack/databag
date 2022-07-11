import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useChannelItem(item) {

  const [state, setState] = useState({
  });

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

