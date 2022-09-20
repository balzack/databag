import { Text } from 'react-native';
import { Logo } from 'utils/Logo';

export function ChannelItem({ item }) {
  return <Logo src={item.logo} width={32} height={32} />
}

