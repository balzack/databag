import { Avatar, Image } from 'antd';
import React, { useState, useEffect, useRef } from 'react'
import { ContactsWrapper, AddButton } from './Contacts.styled';
import { useContacts } from './useContacts.hook';
import { Tabs, Button, Tooltip } from 'antd';
import { Cards } from './Cards/Cards';
import { Channels } from './Channels/Channels';
import { UserAddOutlined, CommentOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

export function Contacts() {

  const { state, actions } = useContacts()
  const [addButton, setAddButton] = useState(<></>);
  const [showRegistry, setShowRegistry] = useState(false);
  let registry = useRef(false);

  const onShowRegistry = () => {
    registry.current = !registry.current;
    setShowRegistry(registry.current);
  }

  const addUser = (
    <Tooltip placement="bottomRight" title="Add Contact">
      <AddButton type="primary" onClick={() => onShowRegistry()} icon={<UserAddOutlined />} />
    </Tooltip>
  )

  const addConversation = (
    <Tooltip placement="bottomRight" title="Add Conversation">
      <AddButton type="primary" icon={<CommentOutlined />} />
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
      <Tabs onChange={onTab} tabBarStyle={{ paddingLeft: 16, paddingRight: 16 }} tabBarExtraContent={addButton}>>
        <TabPane tab="Contacts" key="contact">
          <Cards showRegistry={showRegistry} />
        </TabPane>
        <TabPane tab="Conversations" key="conversation">
          <Channels style={{ backgroundColor: 'red' }} />
        </TabPane>
      </Tabs>
    </ContactsWrapper>
  )
}
