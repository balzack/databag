import { useContext, useState, useEffect } from 'react';
import { getAccountImageUrl } from 'api/getAccountImageUrl';
import { setAccountStatus } from 'api/setAccountStatus';

export function useAccountItem(token, item) {
  
  const [state, setState] = useState({
    statusBusy: false,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({
      disabled: item?.disabled,
      activeClass: item?.disabled ? 'inactive' : 'active',
      accountId: item?.accountId,
      name: item?.name,
      guid: item?.guid,
      handle: item?.handle,
      imageUrl: item?.imageSet ? getAccountImageUrl(token, item?.accountId) : null,
    });
  }, [token, item]); 

  const actions = {
    setStatus: async (disabled) => {
      if (!state.statusBusy) {
        updateState({ statusBusy: true });
        try {
          await setAccountStatus(token, item.accountId, disabled);
          updateState({ disabled, activeClass: disabled ? 'inactive' : 'active' });
        }
        catch(err) {
          console.log(err);
          window.alert(err);
        }
        updateState({ statusBusy: false });
      }
    },
  };

  return { state, actions };
}
