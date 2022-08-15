import { Input, List } from 'antd';
import { ChannelsWrapper } from './Channels.styled';
import { CommentOutlined, SearchOutlined } from '@ant-design/icons';
import { useChannels } from './useChannels.hook';
import { ChannelItem } from './channelItem/ChannelItem';

export function Channels() {

  const { state, actions } = useChannels();

  return (
    <ChannelsWrapper>
      <div class="search">
        <div class="filter">
          <Input bordered={false} allowClear={true} placeholder="Channels" prefix={<SearchOutlined />}
              size="large" spellCheck="false" onChange={(e) => actions.onFilter(e.target.value)} />
        </div>
        { state.display === 'small' && (
          <div class="inline">
            <div class="add">
              <CommentOutlined />
              <div class="label">New</div>
            </div> 
          </div>
        )}
      </div>
      <div class="view">
        <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.channels} gutter="0"
          renderItem={item => (
            <ChannelItem item={item} />
          )}
        />
      </div>
      { state.display !== 'small' && (
        <div class="bar">
          <div class="add">
            <CommentOutlined />
            <div class="label">New Channel</div>
          </div>
        </div>
      )}
    </ChannelsWrapper>
  );
}

