import React, { useState, useEffect } from 'react'
import { Button, Select, Modal } from 'antd';
import { SelectItem } from './AddChannel.styled';
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
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="Select Contacts"
      defaultValue={[]}
      options={options}
      onChange={(value) => console.log(value)}
      optionLabelProp="label"
    />
  )
}
