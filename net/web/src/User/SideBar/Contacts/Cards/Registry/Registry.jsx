import React from 'react';
import { RegistryWrapper, RegistryItem } from './Registry.styled';
import { useRegistry } from './useRegistry.hook';
import { Button, Input, List } from 'antd';
import { Logo } from '../../../../../Logo/Logo';
import { MoreOutlined } from '@ant-design/icons';

export function Registry() {

  const { state, actions } = useRegistry();

  const onSelect = (item) => {
    actions.select(item);
  };

  return (
    <RegistryWrapper>
      <Input.Search placeholder="Server" value={state.server} onChange={(e) => actions.setServer(e.target.Value)} 
          onSearch={actions.getRegistry} style={{ width: '100%' }} />
      <div class="contacts">
      <List
          locale={{ emptyText: '' }}
          itemLayout="horizontal"
          dataSource={state.profiles}
          gutter="0"
          renderItem={item => (
            <RegistryItem onClick={() => onSelect(item)}>
              <div class="item">
                <div class="logo">
                  <Logo imageUrl={actions.getRegistryImageUrl(item.guid, item.revision)}
                    imageSet={item.imageSet} />
                </div>
                <div class="username">
                  <span class="handle">{ item.handle }</span>
                  <span class="name">{ item.name }</span>
                </div>
              </div>
            </RegistryItem>
          )}
        />
      </div>
    </RegistryWrapper>
  );
}

