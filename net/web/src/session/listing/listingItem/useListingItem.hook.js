import { useContext, useState, useEffect } from 'react';
import { getListingImageUrl } from 'api/getListingImageUrl';

export function useListingItem(server, item) {

  const [state, setState] = useState({
    logo: item.imageSet ? getListingImageUrl(server, item.guid) : null,
    name: item.name,
    handle: item.handle,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
  };

  return { state, actions };
}

