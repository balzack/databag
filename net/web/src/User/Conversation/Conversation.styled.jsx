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

  .buttons {
    display: flex;
    flex-direction: row;
    margin-right: 32px;
    align-items: center;
  } 

  .close {
    font-size: 24px;
    color: white;
  }

  .thread {
    position: relative;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    width: 100%;
    overflow: auto; 
  }
`;

export const ConversationButton = styled(Button)`
  text-align: center;
  margin-left: 8px;
  margin-right: 8px;
`

export const CloseButton = styled(Button)`
  font-size: 24px;
  color: white;
`;

export const ListItem = styled.div`
  dispaly: flex;
  flex-direction: row;
  width: 64px;
`;

export const BusySpin = styled(Spin)`
  position: absolute;
  left: calc(50% - 16px);
  top: calc(50% - 16px);
`;
