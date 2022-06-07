import { useContext, useState, useEffect } from 'react';
import { getAccountImageUrl } from 'api/getAccountImageUrl';

export function useAccountItem(token, item) {
  
  const [state, setState] = useState({
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({
      disabled: false,
      accountId: item?.accountId,
      name: item?.name,
      guid: item?.guid,
      handle: item?.handle,
      imageUrl: item?.imageSet ? getAccountImageUrl(token, item?.accountId) : null,
    });
  }, []); 

  const actions = {
  };

  return { state, actions };
}
