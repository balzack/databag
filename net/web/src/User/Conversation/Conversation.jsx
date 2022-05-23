import React, { useState, useEffect, useRef } from 'react'
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import { useConversation } from './useConversation.hook';
import { Button, Input, Checkbox, Modal, Spin } from 'antd'
import { ConversationWrapper, ConversationButton, EditButton, CloseButton, ListItem, BusySpin } from './Conversation.styled';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import { AddTopic } from './AddTopic/AddTopic';
import { VirtualList } from 'VirtualList/VirtualList';
import { TopicItem } from './TopicItem/TopicItem';
import { Members } from './Members/Members';
import { EditOutlined, HomeOutlined, DatabaseOutlined } from '@ant-design/icons';

export function Conversation() {

  const { state, actions } = useConversation();
  const [ showEdit, setShowEdit ] = useState(false);
  const [ showMembers, setShowMembers ] = useState(false);
  const [ editSubject, setEditSubject ] = useState(null);
  const [ subject, setSubject ] = useState(null);

  useEffect(() => {
    if (state.subject) {
      setSubject(state.subject);
    }
    else {
      setSubject(state.contacts);
    }
  }, [state]);

  const topicRenderer = (topic) => {
    return (<TopicItem topic={topic} />)
  }

  const onSaveSubject = () => {
    actions.setSubject(editSubject);
    setShowEdit(false);
  }

  const onEdit = () => {
    setEditSubject(state.subject);
    setShowEdit(true);
  }

  const onMembers = () => {
    setShowMembers(true);
  }

  const Icon = () => {
    if (state.cardId) {
      return <DatabaseOutlined />
    }
    return <HomeOutlined />
  }

  const Edit = () => {
    if (state.cardId) {
      return <></>
    }
    return (
      <EditButton type="text" size={'large'} onClick={() => onEdit()} icon={<EditOutlined />} />
    )
  }

  return (
    <ConversationWrapper>
      <div class="header">
        <div class="title">
          <Icon />
          <div class="subject">{ subject }</div> 
          <Edit /> 
        </div>
        <div class="control">       
          <div class="buttons">
            <ConversationButton ghost onClick={() => onMembers()}>Members</ConversationButton>
            <ConversationButton ghost onClick={() => actions.remove()}>Delete</ConversationButton>
          </div>
          <CloseButton type="text" class="close" size={'large'}
              onClick={() => actions.close()} icon={<CloseOutlined />} />
        </div>
      </div>
      <div class="thread">
        <VirtualList id={state.channelId + state.cardId} 
            items={state.topics} itemRenderer={topicRenderer} />
        <BusySpin size="large" delay="1000" spinning={!state.init} />
      </div>
      <AddTopic />
      <Modal title="Conversation Members" visible={showMembers} centered onCancel={() => setShowMembers(false)}
        footer={[
          <Button key="back" onClick={() => setShowMembers(false)}>Done</Button>
        ]} >
        <Members host={state.cardId} members={state.members} />
      </Modal>
      <Modal title="Edit Subject" visible={showEdit} centered
        okText="Save" onOk={() => onSaveSubject()} onCancel={() => setShowEdit(false)}>
        <Input placeholder="Subject" onChange={(e) => setEditSubject(e.target.value)} value={editSubject} />
      </Modal>
    </ConversationWrapper>
  )
}

