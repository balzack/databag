import styled from 'styled-components';
import { List } from 'antd';

export const ChannelItemWrapper = styled(List.Item)`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 4px;
  padding-bottom: 4px;
  height: 48px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover {
    background-color: #eeeeee;
  }
`;

