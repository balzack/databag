import { Avatar, Image } from 'antd';
import React, { useState, useEffect, useRef } from 'react'
import { ContactsWrapper, AddButton } from './Contacts.styled';
import { useContacts } from './useContacts.hook';
import { Tabs, Button, Tooltip } from 'antd';
import { Cards } from './Cards/Cards';
import { Channels } from './Channels/Channels';
import { TeamOutlined, CommentOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

export function Contacts() {

  const { state, actions } = useContacts()
  const [addButton, setAddButton] = useState(<></>);
  const [showRegistry, setShowRegistry] = useState(false);
  const [startConversation, setStartConversation] = useState(false);
  let registry = useRef(false);

  const onShowRegistry = () => {
    registry.current = !registry.current;
    setShowRegistry(registry.current);
  }

  const addUser = (
    <Tooltip placement="right" title="Add Contact">
      <AddButton type="primary" onClick={() => onShowRegistry()} icon={<TeamOutlined />} />
    </Tooltip>
  )

  const addConversation = (
    <Tooltip placement="right" title="Add Conversation">
      <AddButton type="primary" onClick={() => setStartConversation(true)} icon={<CommentOutlined />} />
    </Tooltip>
  ) 

  const onTab = (key) => {
    registry.current = false;
    setShowRegistry(false);
    if (key === "contact") {
      setAddButton(addUser);
    }
    else {
      setAddButton(addConversation);
    }
  }

  useEffect(() => {
    setAddButton(addUser);
  }, []);

  return (
    <ContactsWrapper>
      <Tabs onChange={onTab} tabBarStyle={{ marginBottom: 0, paddingLeft: 16, paddingRight: 16 }} tabBarExtraContent={addButton} defaultActiveKey="conversation">
        <TabPane tab="Contacts" key="contact">
          <Cards showRegistry={showRegistry} />
        </TabPane>
        <TabPane tab="Conversations" key="conversation">
          <Channels showAdd={startConversation} setShowAdd={setStartConversation} />
        </TabPane>
      </Tabs>
    </ContactsWrapper>
  )
}
