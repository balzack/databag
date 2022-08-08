import { Input } from 'antd';
import { ChannelsWrapper } from './Channels.styled';
import { SearchOutlined } from '@ant-design/icons';

export function Channels() {
  return (
    <ChannelsWrapper>
      <div class="search">
        <div class="filter">
          <Input bordered={false} allowClear={true} placeholder="Channels" prefix={<SearchOutlined />} />
        </div>
      </div>
    </ChannelsWrapper>
  );
}

