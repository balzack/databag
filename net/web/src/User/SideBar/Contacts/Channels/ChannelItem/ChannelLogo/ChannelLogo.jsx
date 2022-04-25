import React, { useEffect, useState, useContext } from 'react'
import { DisconnectOutlined, UserOutlined } from '@ant-design/icons';
import { LogoWrapper, Contact, Host, ChannelImage } from './ChannelLogo.styled';
import { useChannelLogo } from './useChannelLogo.hook';

export function ChannelLogo({ item }) {
  
  const [home, setHome] = useState(false);
  const [host, setHost] = useState(null);
  const [members, setMembers] = useState([]);

  const { state, actions } = useChannelLogo();

  useEffect(() => {

    if (item?.guid) {
      setHome(false);
      setHost(actions.getCardByGuid(item.guid));
      let contacts = [];
      for (let member of item.data.channelDetail.members) {
        if (member != state.guid) {
          contacts.push(actions.getCardByGuid(member));
        }
      }
      setMembers(contacts);
    }
    else {
      setHome(true);
      let contacts = [];
      for (let member of item.data.channelDetail.members) {
        contacts.push(actions.getCardByGuid(member));
      }
      setMembers(contacts);
    } 

  }, [item, state]);

  const Logo = ({card}) => {
    if (card?.data?.cardProfile?.imageSet) {
      let imageUrl = actions.getCardImageUrl(card?.id, card?.revision);
      return <ChannelImage src={ imageUrl } alt='' />
    }
    return <UserOutlined />
  }

  if (members.length == 0 && home) {
    return (
      <LogoWrapper>
        <div class="container">
          <div class="large contact"><DisconnectOutlined /></div>
        </div>
      </LogoWrapper>
    )
  }
  else if (members.length == 0 && !home) {
    return (
      <LogoWrapper>
        <div class="container">
          <div class="large host"><Logo card={host} /></div>
        </div>
      </LogoWrapper>
    )
  }
  else if (members.length == 1 && home) {
    return (
      <LogoWrapper>
        <div class="container">
          <div class="large contact"><Logo card={members[0]} /></div>
        </div>
      </LogoWrapper>
    )
  }
  else if (members.length == 1 && !home) {
    return (
      <LogoWrapper>
        <div class="grid">
          <div class="medium host topleft"><Logo card={host} /></div>
          <div class="medium contact bottomright"><Logo card={members[0]} /></div>
        </div>
      </LogoWrapper>
    )
  }
  else if (members.length == 2 && home) {
    return (
      <LogoWrapper>
        <div class="grid">
          <div class="medium host topleft"><Logo card={members[0]} /></div>
          <div class="medium contact bottomright"><Logo card={members[1]} /></div>
        </div>
      </LogoWrapper>
    )
  }
  else if (members.length == 2 && !home) {
    return (
      <LogoWrapper>
        <div class="grid">
          <div class="small host topleft"><Logo card={host} /></div>
          <div class="small contact topright"><Logo card={members[0]} /></div>
          <div class="small contact bottom"><Logo card={members[1]} /></div>
        </div>
      </LogoWrapper>
    )
  }
  else if (members.length == 3 && home) {
    return (
      <LogoWrapper>
        <div class="grid">
          <div class="small contact topleft"><Logo card={members[0]} /></div>
          <div class="small contact topright"><Logo card={members[1]} /></div>
          <div class="small contact bottom"><Logo card={members[2]} /></div>
        </div>
      </LogoWrapper>
    )
  }
  else if (members.length > 2 && !home) {
    return (
      <LogoWrapper>
        <div class="grid">
          <div class="medium host topleft"><Logo card={host} /></div>
          <div class="medium contact bottomright">{members.length}</div>
        </div>
      </LogoWrapper>
    )
  }
  else if (members.length > 3 && home) {
    return (
      <LogoWrapper>
        <div class="container">
          <div class="large contact">{members.length}</div>
        </div>
      </LogoWrapper>
    )
  }
  return <></>
}

