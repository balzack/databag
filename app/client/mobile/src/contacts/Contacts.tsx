import {useContacts} from './useContacts.hook';
import {ContactParams} from '../profile/Profile';
import {ContactsComponent} from './ContactsComponent';
import {createLayoutComponent} from '../utils/LayoutSelector';

type ContactsProps = {
  layout: string;
  openRegistry: () => void;
  openContact: (params: ContactParams) => void;
  callContact: (card: null | Card) => void;
  textContact: (cardId: null | string) => void;
};

export const Contacts = createLayoutComponent<ContactsProps>(ContactsComponent, ContactsComponent, useContacts);
