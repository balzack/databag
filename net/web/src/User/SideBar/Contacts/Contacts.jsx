import { Avatar, Image } from 'antd';
import React from 'react'
import { ContactsWrapper } from './Contacts.styled';
import { useContacts } from './useContacts.hook';
import { Tabs } from 'antd';
import { Cards } from './Cards/Cards';
import { Channels } from './Channels/Channels';

const { TabPane } = Tabs;

export function Contacts() {

  const { state, actions } = useContacts()

  return (
    <ContactsWrapper>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Contacts" key="1">
          <Cards />
        </TabPane>
        <TabPane tab="Conversations" key="2">
          <Channels />
        </TabPane>
      </Tabs>
    </ContactsWrapper>
  )
}
