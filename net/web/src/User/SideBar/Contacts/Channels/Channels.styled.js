import styled from 'styled-components';
import { List } from 'antd';

export const ChannelsWrapper = styled.div`
  position: relative;
  height: calc(100vh - 127px);
  width: 100%;
  overflow: hidden;
  text-align: center;
  border-radius: 2px;
`;

export const ChannelItem = styled(List.Item)`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 4px;
  padding-bottom: 4px;
  height: 64px;
  cursor: pointer;
  &:hover {
    background-color: #eeeeee;
  }
`;

