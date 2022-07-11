import styled from 'styled-components';
import { List } from 'antd';
import { StarTwoTone } from '@ant-design/icons';

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
    background-color: #f0f5e0;
  }
`;

export const Marker = styled(StarTwoTone)`
  position: relative;
  left: -16px;
  top: 8px;
`
