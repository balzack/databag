import { Modal, Input, List, Button } from 'antd';
import { ChannelsWrapper, AddFooter } from './Channels.styled';
import { CommentOutlined, SearchOutlined } from '@ant-design/icons';
import { useChannels } from './useChannels.hook';
import { ChannelItem } from './channelItem/ChannelItem';
import { AddChannel } from './addChannel/AddChannel';

export function Channels({ open, active }) {

  const { state, actions } = useChannels();

  const addChannel = async () => {
    try {
      const id = await actions.addChannel();
      actions.clearShowAdd();
      open(id);
    }
    catch(err) {
      Modal.error({
        title: 'Failed to Create Channel',
        content: 'Please try again.',
      });
    }
  };

  const addFooter = (
    <AddFooter>
      <Button key="back" onClick={actions.clearShowAdd}>Cancel</Button>
      <Button key="save" type="primary" loading={state.busy} onClick={addChannel}>Save</Button>
    </AddFooter>
  );

  return (
    <ChannelsWrapper>
      <div class="search">
        <div class="filter">
          <Input bordered={false} allowClear={true} placeholder="Topics" prefix={<SearchOutlined />}
              spellCheck="false" onChange={(e) => actions.onFilter(e.target.value)} />
        </div>
        { state.display === 'small' && (
          <div class="inline">
            <div class="add" onClick={actions.setShowAdd}>
              <CommentOutlined />
              <div class="label">New</div>
            </div> 
          </div>
        )}
      </div>
      <div class="view">
        { state.channels.length > 0 && (
          <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.channels} gutter="0"
            renderItem={item => (
              <ChannelItem item={item} openChannel={open} active={active} />
            )}
          />
        )}
        { state.channels.length == 0 && (
          <div class="empty">No Topics</div>
        )}
      </div>
      { state.display !== 'small' && (
        <div class="bar">
          <div class="add" onClick={actions.setShowAdd}>
            <CommentOutlined />
            <div class="label">New Topic</div>
          </div>
        </div>
      )}
      <Modal title="New Topic" centered visible={state.showAdd} footer={addFooter}
          onCancel={actions.clearShowAdd}>
        <AddChannel state={state} actions={actions} />
      </Modal>
    </ChannelsWrapper>
  );
}

