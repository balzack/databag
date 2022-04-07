import React, { useEffect, useState } from 'react'
import { ChannelsWrapper, ChannelItem } from './Channels.styled';
import { List, Button, Select, Modal } from 'antd';
import { useChannels } from './useChannels.hook';
import { AddChannel } from './AddChannel/AddChannel';

export function Channels({ showAdd, setShowAdd }) {

  const { state, actions } = useChannels();

console.log(state.channels);

  const onStart = async () => {
    if (await actions.addChannel()) {
      setShowAdd(false);
    }
  }

  const onSelect = (item) => {
    console.log(item);
  }

  return (
    <ChannelsWrapper>
      <List
        locale={{ emptyText: '' }}
        itemLayout="horizontal"
        dataSource={state.channels}
        gutter="0"
        renderItem={item => (
          <ChannelItem onClick={() => onSelect(item)}>
          </ChannelItem>
        )}
      />
      <Modal title="Start Conversation" visible={showAdd} centered
          okText="Start" onOk={() => onStart()} onCancel={() => setShowAdd(false)}>
        <AddChannel state={state} actions={actions} />
      </Modal>
    </ChannelsWrapper>
  )
}
