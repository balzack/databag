import { useState, useRef } from 'react';

export function useVirtualList(id) {

  const [state, setState] = useState({
    view: null,
    listHeight: 128,
    slots: [],
  });

  const slots = useRef(new Map());

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const actions = {
    setView: (view) => {
      updateState({ view });
    },
    setListHeight: (listHeight) => {
      updateState({ listHeight: listHeight });
    },
    addSlot: (id, slot) => {
      slots.current.set(id, slot);
      let items = Array.from(slots.current.values());
      updateState({ slots: items });
    },
    updateSlot: (id, slot) => {
      slots.current.set(id, slot);
      let items = Array.from(slots.current.values());
      updateState({ slots: items });
    },
    removeSlot: (id) => {
      slots.current.set(id, (<></>));
      let items = Array.from(slots.current.values());
      updateState({ slots: items });
    },
    clearSlots: () => {
      slots.current = new Map();
      let items = Array.from(slots.current.values());
      updateState({ slots: items });
    },
  };

  return { state, actions };
}

