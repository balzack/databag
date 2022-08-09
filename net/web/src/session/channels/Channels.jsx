import { Input, List } from 'antd';
import { ChannelsWrapper } from './Channels.styled';
import { SearchOutlined } from '@ant-design/icons';
import { useChannels } from './useChannels.hook';
import { ChannelItem } from './channelItem/ChannelItem';

export function Channels() {

  const { state, actions } = useChannels();

console.log(state);

  return (
    <ChannelsWrapper>
      <div class="search">
        <div class="filter">
          <Input bordered={false} allowClear={true} placeholder="Channels" prefix={<SearchOutlined />} />
        </div>
      </div>
      <div class="results">
        <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.channels} gutter="0"
          renderItem={item => (
            <ChannelItem item={item} />
          )}
        />
      </div>
    </ChannelsWrapper>
  );
}

