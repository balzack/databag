import styled from 'styled-components';
import { Button, Spin } from 'antd';

export const ConversationWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #f6f5ed;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  .header {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    background-color: #888888;
    height: 64px;
    padding-right: 16px;
    padding-left: 16px;
  }

  .title {
    height: 64px;
    flex-grow: 1;
    text-align: center;
    font-size: 2em;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: flex-begin;
    color: white;
    padding-left: 16px;
  }

  .close {
    font-size: 24px;
    color: white;
  }

  .container {
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    width: 100%;
    overflow: auto; 
  }
`;

export const CloseButton = styled(Button)`
  font-size: 24px;
  color: white;
`;

export const ListItem = styled.div`
  dispaly: flex;
  flex-direction: row;
  width: 64px;
`;

