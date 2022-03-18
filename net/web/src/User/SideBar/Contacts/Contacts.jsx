import { Avatar, Image } from 'antd';
import React from 'react'
import { ContactsWrapper } from './Contacts.styled';
import { useContacts } from './useContacts.hook';

export function Contacts() {

  const { state, actions } = useContacts()

  return (
    <ContactsWrapper>
    </ContactsWrapper>
  )
}
