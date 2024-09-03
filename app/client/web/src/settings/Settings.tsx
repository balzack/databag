import { useSettings } from './useSettings.hook';

export function Settings() {
  const { state, actions } = useSettings();

  console.log(state);
  
  return <div>SETTINGS!!!</div>
}

