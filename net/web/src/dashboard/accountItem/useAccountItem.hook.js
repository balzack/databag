import { useContext, useState, useEffect } from 'react';
import { getAccountImageUrl } from 'api/getAccountImageUrl';
import { setAccountStatus } from 'api/setAccountStatus';
import { addAccountAccess } from 'api/addAccountAccess';
import { ViewportContext } from 'context/ViewportContext';

export function useAccountItem(token, item, remove) {
  
  const [state, setState] = useState({
    statusBusy: false,
    removeBusy: false,
    accessBusy: false,
    showAccess: false,
  });
 
  const viewport = useContext(ViewportContext); 

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

  useEffect(() => {
    updateState({ display: viewport.state.display });
  }, [viewport]);

  const actions = {
    setAccessLink: async () => {
      if (!state.accessBusy) {
        updateState({ accessBusy: true });
        try {
          let access = await addAccountAccess(token, item.accountId);
          updateState({ accessToken: access, showAccess: true });
        }
        catch (err) {
          window.alert(err);
        }
        updateState({ accessBusy: false });
      }
    },
    setShowAccess: (showAccess) => {
      updateState({ showAccess });
    },
    remove: async () => {
      if (!state.removeBusy) {
        updateState({ removeBusy: true });
        try {
          await remove(state.accountId);
        }
        catch(err) {
          console.log(err);
          window.alert(err);
        }
        updateState({ removeBusy: false });
      }
    },
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
