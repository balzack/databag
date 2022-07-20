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

  .edit {
    font-size: 18px;
    color: white;
  }

  .header {
    flex-grow: 1;
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
    display: flex;
    flex-direction: row;
    flex-shrink: 1;
    jsutify-content: flex-begin;
    height: 64px;
    align-items: center;
    color: white;
    font-size: 1.5em;
    min-width: 0;
    padding-right: 8px;
  }

  .control {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    justify-content: flex-end;
  }

  .subject {
    padding-left: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    margin-right: 16px;
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

    .uploading {
      position: absolute;
      top: 0px;
      right: 0px;
      display: flex;
      flex-direction: column;
      z-index: 10;
      border-bottom: 1px solid #888888;
      border-left: 1px solid #888888;
      border-bottom-left-radius: 4px;
      padding-left: 8px;
      background-color: #ffffff;

      .progress {
        width: 250px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .index {
          display: flex;
          width: 64px;
          justify-content: center;
          color: #444444; 
          font-size: 12px;
        }
      }
    }
  }
`;

export const ConversationButton = styled(Button)`
  text-align: center;
  margin-left: 8px;
  margin-right: 8px;
`

export const EditButton = styled(Button)`
  font-size: 24px;
  color: white;
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

export const BusySpin = styled(Spin)`
  position: absolute;
  left: calc(50% - 16px);
  top: calc(50% - 16px);
`;

export const Offsync = styled.div`
  padding-left: 8px;
  color: #ff8888;
  cursor: pointer;
`
