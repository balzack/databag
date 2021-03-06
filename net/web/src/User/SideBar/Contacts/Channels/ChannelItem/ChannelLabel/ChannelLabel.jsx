import React, { useState, useEffect } from 'react';
import { useChannelLabel } from './useChannelLabel.hook';
import { LabelWrapper } from './ChannelLabel.styled';
import { HomeOutlined, DatabaseOutlined } from '@ant-design/icons';

export function ChannelLabel({ item }) {

  const [host, setHost] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const { state, actions } = useChannelLabel();

  useEffect(() => {

    try {
      if (item.data.channelSummary.lastTopic.dataType === 'superbasictopic') {
        let msg = JSON.parse(item.data.channelSummary.lastTopic.data);
        setMessage(msg.text);
      }
      else {
        setMessage('');
      }
    }
    catch (err) {
      console.log(err);
      setMessage('');
    }
 
    let contacts = []; 
    if (item?.guid) {
      setHost(false);
      contacts.push(actions.getCardByGuid(item.guid)?.data?.cardProfile?.handle);
    }
    else {
      setHost(true); 
    }
    for (let member of item.data.channelDetail.members) {
      let contact = actions.getCardByGuid(member)?.data?.cardProfile?.handle;
      if (contact) {
        contacts.push(contact);
      }
    }

    if (item?.data?.channelDetail?.data) {
      try {
        let data = JSON.parse(item.data.channelDetail.data);
        if (data.subject != '' && data.subject != null) {
          setSubject(data.subject);
          return
        }
      }
      catch (err) {
        console.log(err);
        setSubject(null);
      }
    }
    setSubject(contacts.join(', '));
  }, [item, state]);

  const Host = () => {
    if (host) {
      return <HomeOutlined />
    }
    return <DatabaseOutlined />
  }

  return (
    <LabelWrapper>
      <div class="title">
        <div class="subject">{subject}</div>
        <Host />
      </div>
      <div class="message">{message}</div>
    </LabelWrapper>
  )
}

