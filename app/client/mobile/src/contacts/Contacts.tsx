import React from 'react';
import {useContacts} from './useContacts.hook';
import {ContactParams} from '../profile/Profile';
import {ContactsSmall} from './ContactsSmall';
import {ContactsLarge} from './ContactsLarge';
import {createLayoutComponent} from '../utils/LayoutSelector';

type ContactsProps = {
  openRegistry: () => void;
  openContact: (params: ContactParams) => void;
  callContact: (card: null | Card) => void;
  textContact: (cardId: null | string) => void;
};

export const Contacts = createLayoutComponent<ContactsProps>(
  ContactsSmall,
  ContactsLarge,
  useContacts
);
