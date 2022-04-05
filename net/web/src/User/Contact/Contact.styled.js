import styled from 'styled-components';
import { Button, Spin } from 'antd';

export const ContactWrapper = styled.div`
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

  .contact {
    display: flex;
    flex-direction: column;
    align-items: flex-begin;
    flex: 3
  }

  .control {
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 8px;
  }

  .status {
    color: #444444;
  }
   
  .buttons {
    display: flex;
    flex-direction: row;
    margin-right: 32px;
  } 

  .profile {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex: 2
  }

  .container {
    display: flex;
    flex-direction: row;
    padding: 32px;
    width: 100%;
    overflow: auto; 
  }

  .avatar {
    color: #888888;
    height: 192px;
    min-height: 192px;
    width: 192px;
    min-width: 192px;
    font-size: 8em;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #888888;
  }

  .logo {
    width: 192px;
    height 192px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .unset {
    font-style: italic;
    color: #dddddd;
  }

  .label {
    padding-right: 4;
    font-size: 1em;
    color: #888888;
  }

  .details {
    padding: 16px;
    border-right: 0.5px solid #aaaaaa;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .name {
    font-size: 1.5em;
    padding-bottom: 16px;
    text-align: right;
  }

  .location {
    font-size: 1.2em;
    padding-bottom: 16px;
    text-align: right;
  }

  .description {
    font-size: 1em;
    padding-bottom: 16px;
    text-align: right;
  }

  .block {
    border-bottom: 0.5px solid #aaaaaa;
    display: flex;
    flex-direction: row;
    margin-top: 32px;
    align-items: center;
    justify-content: flex-end;
    width: 50%;
  }
`;

export const CloseButton = styled(Button)`
  font-size: 24px;
  color: white;
`;

export const ProfileButton = styled(Button)`
  text-align: center;
  margin-left: 8px;
  margin-right: 8px;
`;

export const ContactSpin = styled(Spin)`
  padding-right: 32px;
`;

