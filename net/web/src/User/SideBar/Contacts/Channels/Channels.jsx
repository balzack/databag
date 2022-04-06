import React, { useEffect, useState } from 'react'
import { ChannelsWrapper } from './Channels.styled';
import { Button, Select, Modal } from 'antd';
import { useChannels } from './useChannels.hook';
import { AddChannel } from './AddChannel/AddChannel';

export function Channels({ showAdd, setShowAdd }) {

  const { state, actions } = useChannels();

  const onStart = async () => {
    if (await actions.addChannel()) {
      setShowAdd(false);
    }
  }

  return (
    <ChannelsWrapper>
      <Modal title="Start Conversation" visible={showAdd} centered
          okText="Start" onOk={() => onStart()} onCancel={() => setShowAdd(false)}>
        <AddChannel state={state} actions={actions} />
      </Modal>
    </ChannelsWrapper>
  )
}
