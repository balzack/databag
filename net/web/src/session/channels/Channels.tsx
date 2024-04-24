import { Modal, Input, List, Button, Tooltip } from 'antd';
import { ChannelsWrapper } from './Channels.styled';
import { CommentOutlined, SearchOutlined } from '@ant-design/icons';
import { useChannels } from './useChannels.hook';
import { ChannelItem } from './channelItem/ChannelItem';
import { AddChannel } from './addChannel/AddChannel';

export function Channels({ open, active }) {

  const { state, actions } = useChannels();

  const added = (id) => {
    actions.clearShowAdd();
    open(id);
  };

  return (
    <ChannelsWrapper>
      <div className="search">
        <div className="filter">
          <Input className="filterControl" bordered={false} placeholder={state.strings.topics} prefix={<SearchOutlined />}
              spellCheck="false" onChange={(e) => actions.onFilter(e.target.value)} />
        </div>
        { state.display === 'small' && (
          <div className="inline">
            <Button type="primary" disabled={!state.allowAdd} icon={<CommentOutlined />} onClick={actions.setShowAdd}>{state.strings.new}</Button>
          </div>
        )}
      </div>
      <div className="view">
        { state.channels.length > 0 && (
          <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.channels} gutter="0"
            renderItem={item => (
              <ChannelItem item={item} openChannel={open} tip={state.strings.newMessage}
                  active={active.card === item.cardId && active.channel === item.channelId} />
            )}
          />
        )}
        { state.channels.length === 0 && (
          <div className="empty">{ state.strings.noTopics }</div>
        )}
      </div>
      { state.display !== 'small' && (
        <div className="bar">
          <Tooltip placement="right" title={ state.allowAdd ? '' : state.strings.unsetSealing }>
            <Button className={state.allowAdd ? 'addEnabled' : 'addDisabled'} type="primary" disabled={!state.allowAdd} icon={<CommentOutlined />} onClick={actions.setShowAdd}>{state.strings.newTopic}</Button>
          </Tooltip>
        </div>
      )}
      <Modal bodyStyle={{ padding: 16, ...state.menuStyle }} closable={false} centered visible={state.showAdd && state.allowAdd} footer={null} destroyOnClose={true} onCancel={actions.clearShowAdd}>
        <AddChannel added={added} cancelled={actions.clearShowAdd} />
      </Modal>
    </ChannelsWrapper>
  );
}

