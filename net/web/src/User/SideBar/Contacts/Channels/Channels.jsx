import React, { useEffect, useState } from 'react'
import { ChannelsWrapper } from './Channels.styled';
import { List, Button, Select, Modal } from 'antd';
import { useChannels } from './useChannels.hook';
import { AddChannel } from './AddChannel/AddChannel';
import { ChannelItem } from './ChannelItem/ChannelItem';

export function Channels({ showAdd, setShowAdd }) {

  const { state, actions } = useChannels();

  const onStart = async () => {
    if (await actions.addChannel()) {
      setShowAdd(false);
    }
  }

  return (
    <ChannelsWrapper>
      <List
        locale={{ emptyText: '' }}
        itemLayout="horizontal"
        dataSource={state.channels}
        gutter="0"
        renderItem={item => (
          <ChannelItem item={item} />
        )}
      />
      <Modal title="Start Conversation" visible={showAdd} centered
          okText="Start" onOk={() => onStart()} onCancel={() => setShowAdd(false)}>
        <AddChannel state={state} actions={actions} />
      </Modal>
    </ChannelsWrapper>
  )
}
