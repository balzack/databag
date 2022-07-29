import React from 'react';
import { RegistryWrapper, RegistryItem } from './Registry.styled';
import { useRegistry } from './useRegistry.hook';
import { Button, Input, List } from 'antd';
import { Logo } from '../../../../../Logo/Logo';
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';

export function Registry() {

  const { state, actions } = useRegistry();

  const onSelect = (item) => {
    actions.select(item);
  };

  const registryImage = (item) => {
    if (actions?.getRegistryImageUrl) {
      return actions.getRegistryImageUrl(item.guid);
    }
    return null
  }

  return (
    <RegistryWrapper>
      { state.server && (
        <Input.Search placeholder="Server" value={state.server}
            onChange={(e) => actions.setServer(e.target.value)} 
            onSearch={actions.getRegistry} style={{ width: '100%' }} />
      )}
      { !state.server && (
        <div class="local">
          <div class="local-name">{ window.location.host }</div>
          <Button icon={<SearchOutlined />} onClick={actions.getRegistry}></Button>
        </div>
      )}
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
                  <Logo imageUrl={registryImage(item)}
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

