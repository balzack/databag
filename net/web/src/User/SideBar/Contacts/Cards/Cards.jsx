import React, { useEffect } from 'react'
import { CardsWrapper, CardItem } from './Cards.styled';
import { Drawer, List } from 'antd';
import { Registry } from './Registry/Registry';
import { useCards } from './useCards.hook';
import { Logo } from '../../../../Logo/Logo';

export function Cards({ showRegistry }) {

  const { state, actions } = useCards();

  const onSelect = (item) => {
    actions.select(item);
  }

  const cardProfile = (item) => {
    if (item?.data?.cardProfile) {
      return item.data.cardProfile;
    }
    return {}
  }

  const cardImage = (item) => {
    if (actions?.getImageUrl) {
      return actions.getImageUrl(item.id);
    }
    return null
  }

  const cardHandle = (item) => {
    const profile = item.data?.cardProfile
    if (profile) {
      if (profile.node == state.node) {
        return profile.handle;
      }
      return profile.handle + '@' + profile.node;
    }
    return null; 
  }

  return (
    <CardsWrapper>
      <Drawer
        placement="right"
        closable={false}
        visible={showRegistry}
        getContainer={false}
        contentWrapperStyle={{ width: '100%' }}
        bodyStyle={{ backgroundColor: '#f6f5ed', paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 0 }}
        style={{ position: 'absolute' }}
      >
        <Registry />
      </Drawer>
      <List
        locale={{ emptyText: '' }}
        itemLayout="horizontal"
        dataSource={state.cards}
        gutter="0"
        renderItem={item => (
          <CardItem onClick={() => onSelect(item)}>
            <div class="item">
              <div class="logo">
                <Logo imageUrl={cardImage(item)}
                  imageSet={cardProfile(item).imageSet} />
              </div>
              <div class="username">
                <span class="name">{ cardProfile(item).name }</span>
                <span class="handle">{ cardHandle(item) }</span>
              </div>
            </div>
          </CardItem>
        )}
      />
    </CardsWrapper>
  )
}

