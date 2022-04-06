import React, { useState, useEffect } from 'react'
import { Button, Select, Modal, Collapse, Input } from 'antd';
import { SelectItem, ConversationWrapper, Description, BusySpin } from './AddChannel.styled';
import { Logo } from '../../../../../Logo/Logo';

export function AddChannel({ state, actions }) {

  const [ options, setOptions ] = useState([]);

  useEffect(() => {
    let contacts = [];
    let cards = actions.getCards();
    for (let card of cards) {
      contacts.push({ value: card.id, label: card.data.cardProfile.handle });
    }
    setOptions(contacts);
  }, [actions]);

  return (
    <ConversationWrapper>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select Contacts"
        defaultValue={[]}
        options={options}
        onChange={(value) => actions.setStartCards(value)}
        optionLabelProp="label"
      />
      <Collapse ghost="true">
        <Collapse.Panel header="Conversation Details (optional)" key="1">
          <Input placeholder="Subject" onChange={(e) => actions.setStartSubject(e.target.value)} value={state.startSubject} />
          <Description placeholder="Description" autoSize={{ minRows: 2, maxRows: 6 }}
              onChange={(e) => actions.setStartDescription(e.target.value)} value={state.startDescription} />
        </Collapse.Panel>
      </Collapse>
      <BusySpin size="large" spinning={state.busy} />
    </ConversationWrapper>
  )
}
