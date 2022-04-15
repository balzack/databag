import React, { useState, useEffect } from 'react';
import { useChannelLabel } from './useChannelLabel.hook';
import { LabelWrapper } from './ChannelLabel.styled';
import { HomeOutlined, DatabaseOutlined } from '@ant-design/icons';

export function ChannelLabel({ item }) {

  const [host, setHost] = useState(null);
  const [members, setMembers] = useState([]);
  const [subject, setSubject] = useState('');

  const { state, actions } = useChannelLabel();

  useEffect(() => {
    
    let contacts = []; 
    if (item?.guid) {
      setHost(actions.getCardByGuid(item.guid));
      for (let member of item.channel.data.channelDetail.members) {
        if (member != state.guid) {
          contacts.push(actions.getCardByGuid(member));
        }
      }
      setMembers(contacts);
    }
    else {
      setHost(null); 
      for (let member of item.channel.data.channelDetail.members) {
        contacts.push(actions.getCardByGuid(member));
      }
      setMembers(contacts);
    }

    if (item?.channel?.data?.channelDetail?.data) {
      let data = JSON.parse(item.channel.data.channelDetail.data);
      if (data.subject != '' && data.subject != null) {
        setSubject(data.subject);
        return
      }
    }

    let names = ''
    for (let contact of contacts) {
      if (contact != null) {
        if (names != '') {
          names += ', ';
        }
        names += contact.data.cardProfile.handle;
      }
    }
    if (names != '') {
      names = '[' + names + ']';
    }
    setSubject(names)

  }, [item, state]);

  const Host = () => {
    if (host) {
      return (<div><DatabaseOutlined />&nbsp;{ host.data.cardProfile.handle }</div>)
    }
    return <HomeOutlined />
  }

  return (
    <LabelWrapper>
      <div class="subject">{subject}</div>
      <div class="host"><Host /></div>
    </LabelWrapper>
  )
}

