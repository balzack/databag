import { useContext, useState, useEffect } from 'react';
import { getListingImageUrl } from 'api/getListingImageUrl';

export function useListingItem(server, item) {

  const [state, setState] = useState({
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({
      logo: item.imageSet ? getListingImageUrl(server, item.guid) : null,
      name: item.name,
      handle: item.handle,
    });
  }, [server, item]);

  const actions = {
  };

  return { state, actions };
}

