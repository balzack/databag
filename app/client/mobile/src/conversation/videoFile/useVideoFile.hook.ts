import {useState} from 'react';

export function useVideoFile() {
  const [state, setState] = useState({
    loaded: false,
    ratio: 1,
    duration: 0,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  const actions = {
    loaded: e => {
      const {width, height} = e.naturalSize;
      updateState({loaded: true, ratio: width / height, duration: e.duration});
    },
  };

  return {state, actions};
}
