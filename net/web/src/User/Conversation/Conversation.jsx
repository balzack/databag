import React, { useState, useEffect, useRef } from 'react'
import { ExclamationCircleOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import { useConversation } from './useConversation.hook';
import { Button, Input, Progress, Checkbox, Modal, Spin, Tooltip } from 'antd'
import { ConversationWrapper, ConversationButton, EditButton, CloseButton, ListItem, BusySpin, Offsync } from './Conversation.styled';
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

  const onMoreTopics = () => {
    actions.more();
  }

  const topicRenderer = (topic) => {
    return (<TopicItem host={state.cardId == null} topic={topic} />)
  }

  const onSaveSubject = () => {
    actions.setSubject(editSubject);
    setShowEdit(false);
  }

  const onEdit = () => {
    setEditSubject(state.subject);
    setShowEdit(true);
  }

  const uploadProgress = () => {
    let progress = [];
    for (let entry of state.progress) {
      if (entry.error) {
        progress.push(
          <div class="progress">
            <div class="index">{ entry.index }/{ entry.count }</div>
            <Progress percent={100} size="small" status="exception" showInfo={false} />
            <Button type="link" onClick={() => actions.cancel(entry.topicId)}>Clear</Button>
          </div>
        );
      }
      else {
        progress.push(
          <div class="progress">
            <div class="index">{ entry.index }/{ entry.count }</div>
            <Progress percent={Math.floor(100 * entry.active?.loaded / entry.active?.total)} size="small" showInfo={false} />
            <Button type="link" onClick={() => actions.cancel(entry.topicId)}>Cancel</Button>
          </div>
        );
      }
    }
    return progress;
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

  const showDelete = () => {
    Modal.confirm({
      title: 'Do you want to delete this conversation?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes, Delete',
      cancelText: 'No, Cancel',
      onOk() { actions.remove() },
    });
  };

  return (
    <ConversationWrapper>
      <div class="header">
        <div class="title">
          <Icon />
          <div class="subject">{ subject }</div> 
          <Edit />
          { state.error && (
            <Tooltip placement="right" title="sync failed: click to retry">
              <Offsync onClick={() => {actions.resync()}}>
                <ExclamationCircleOutlined />
              </Offsync>
            </Tooltip>
          )}
        </div>
        <div class="control">       
          <div class="buttons">
            <ConversationButton ghost onClick={() => onMembers()}>Members</ConversationButton>
            <ConversationButton ghost onClick={() => showDelete()}>Delete</ConversationButton>
          </div>
          <CloseButton type="text" class="close" size={'large'}
              onClick={() => actions.close()} icon={<CloseOutlined />} />
        </div>
      </div>
      <div class="thread">
        { state.progress && (
          <div class="uploading">
            { uploadProgress() }
          </div>
        )}
        <VirtualList id={state.channelId + state.cardId} 
            items={state.topics} itemRenderer={topicRenderer} onMore={onMoreTopics} />
        <BusySpin size="large" delay="1000" spinning={state.loading} />
      </div>
      <AddTopic />
      <Modal title="Conversation Members" visible={showMembers} centered onCancel={() => setShowMembers(false)}
        width={400} bodyStyle={{ padding: 0 }} footer={[]} >
          <Members host={state.cardId} members={state.members} />
      </Modal>
      <Modal title="Edit Subject" visible={showEdit} centered
        okText="Save" onOk={() => onSaveSubject()} onCancel={() => setShowEdit(false)}>
        <Input placeholder="Subject" onChange={(e) => setEditSubject(e.target.value)} value={editSubject} />
      </Modal>
    </ConversationWrapper>
  )
}

