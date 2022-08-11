import { Input, List } from 'antd';
import { ChannelsWrapper } from './Channels.styled';
import { SearchOutlined } from '@ant-design/icons';
import { useChannels } from './useChannels.hook';
import { ChannelItem } from './channelItem/ChannelItem';
import { AddTopic } from './addTopic/AddTopic';

export function Channels() {

  const { state, actions } = useChannels();

  return (
    <ChannelsWrapper>
      <div class="view">
        <div class="search">
          <div class="filter">
            <Input bordered={false} allowClear={true} placeholder="Channels" prefix={<SearchOutlined />}
                size="large" spellCheck="false" onChange={(e) => actions.onFilter(e.target.value)} />
          </div>
        </div>
        <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.channels} gutter="0"
          renderItem={item => (
            <ChannelItem item={item} />
          )}
        />
      </div>
      <AddTopic />
    </ChannelsWrapper>
  );
}

