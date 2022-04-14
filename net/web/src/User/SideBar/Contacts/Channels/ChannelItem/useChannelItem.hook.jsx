import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useChannelItem() {

  const [state, setState] = useState({
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const navigate = useNavigate();

  const actions = {
    select: (item) => {
      if (item.guid) {
        navigate(`/user/conversation/${item.guid}/${item.channel.id}`);
      }
      else {
        navigate(`/user/conversation/${item.channel.id}`);
      }
    },
  };

  return { state, actions };
}

