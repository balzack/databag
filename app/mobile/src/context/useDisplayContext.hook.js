import { useEffect, useContext, useState, useRef } from 'react';

export function useDisplayContext() {
  const [state, setState] = useState({
    modal: false,
    modalTitle: null,
    modalCancel: null,
    modalOk: null,
  });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
    showModal: (modalTitle, modalCancel, modalOk) => {
      updateState({ modal: true, modalTitle, modalCancel, modalOk });
    },
    hideModal: () => {
      updateState({ modal: false });
    },
  };

  return { state, actions }
}

