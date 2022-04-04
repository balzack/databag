import styled from 'styled-components';
import { Button } from 'antd';

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
    background-color: #dddddd;
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
    justify-content: center;
  }

  .close {
    font-size: 24px;
    color: #aaaaaa;
  }

  .contact {
    display: flex;
    flex-direction: column;
    align-items: flex-begin;
    flex: 3
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
    display: flex;
    justify-content: flex-end;
  }

  .unset {
    font-style: italic;
    color: #dddddd;
  }


  .label {
    padding-right: 8px;
    font-size: 1em;
    font-weight: bold;
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
    cursor: pointer;
  }
`;

export const CloseButton = styled(Button)`
  font-size: 24px;
  color: #aaaaaa;
`;
