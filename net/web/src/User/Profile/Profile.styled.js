import { Input, Button, Spin } from 'antd';
import styled from 'styled-components';

export const ProfileWrapper = styled.div`
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
    background-color: #dddddd;
    height: 64px;
    padding-right: 16px;
    padding-left: 16px;
  }

  .title {
    flex-grow: 1;
    text-align: center;
    font-size: 2em;
    font-weight: bold;
  }

  .close {
    font-size: 24px;
    color: #aaaaaa;
  }

  .profile {
    display: flex;
    flex-direction: row;
    padding: 1em;
    width: 66%;
    margin-top: 32px;
  }

  .logo {
    width: 100%;
    height: 100%;
    width: 192px;
    height: 192px;
    border: 1px solid #dddddd;
    border-radius: 8px;
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
  }

  .avatar {
    color: #888888;
    width: 192px;
    height: 192px;
    font-size: 8em;
    display: flex;
    justify-content: flex-end;
  }

  .logoedit {
    align-self: flex-end;
    font-size: 16px;
    position: relative;
    left: -24px;
    cursor: pointer;
  }

  .detailedit {
    font-size: 16px;
  }

  .unset {
    font-style: italic;
    color: #dddddd;
  }

  .details {
    padding-left: 2em;
    margin-left: 2em;
    border-left: 0.5px solid #aaaaaa;
  }

  .name {
    font-size: 1.5em;
    padding-left: 8px;
  }

  .location {
    font-size: 1.2em;
    padding-left: 8px;
  }

  .description {
    font-size: 1em;
    padding-left: 8px;
  }
`;

export const CloseButton = styled(Button)`
  font-size: 24px;
  color: #aaaaaa;
`;

