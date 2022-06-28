import React, { useState, useEffect } from 'react'
import { Space, Button, Select, Modal, Collapse, Input } from 'antd';
import { SelectItem, ConversationWrapper, Description, BusySpin } from './AddChannel.styled';
import { Logo } from '../../../../../Logo/Logo';

export function AddChannel({ state, actions }) {

  const [ options, setOptions ] = useState([]);

  useEffect(() => {
    let contacts = [];
    let cards = actions.getCards();
    for (let card of cards) {
      let handle = card.data.cardProfile.handle;
      if (state.node != card.data.cardProfile.node) {
        handle += '@' + card.data.cardProfile.node;
      }
      contacts.push({ value: card.id, label: handle });
    }
    setOptions(contacts);
  }, [actions]);

  return (
    <ConversationWrapper>
      <Space direction="vertical">
        <Input placeholder="Subject (optional)" onChange={(e) => actions.setStartSubject(e.target.value)}
          value={state.startSubject} />
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select Contacts"
          defaultValue={[]}
          options={options}
          onChange={(value) => actions.setStartCards(value)}
          optionLabelProp="label"
        />
      </Space>
      <BusySpin size="large" spinning={state.busy} />
    </ConversationWrapper>
  )
}
