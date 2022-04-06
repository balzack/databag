import React, { useEffect, useState } from 'react'
import { ChannelsWrapper } from './Channels.styled';
import { Button, Select, Modal } from 'antd';
import { useChannels } from './useChannels.hook';
import { AddChannel } from './AddChannel/AddChannel';

export function Channels({ showAdd, setShowAdd }) {

  const { state, actions } = useChannels();

  return (
    <ChannelsWrapper>
      <Modal title="Start Conversation" visible={showAdd} centered
          onOk={() => setShowAdd(false)} onCancel={() => setShowAdd(false)}>
        <AddChannel state={state} actions={actions} />
      </Modal>
    </ChannelsWrapper>
  )
}
