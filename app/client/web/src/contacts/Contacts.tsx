import { Text } from '@mantine/core'
import { useContacts } from './useContacts.hook';

export function Contacts() {
  const { state, actions } = useContacts();

  return <Text>CONTACTS</Text>
}
