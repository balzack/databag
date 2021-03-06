import { Input, Button, Spin } from 'antd';
import styled from 'styled-components';
import { EditOutlined } from '@ant-design/icons';

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
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: flex-begin;
    padding-left: 16px;
  }

  .close {
    font-size: 24px;
    color: #aaaaaa;
  }

  .container {
    display: flex;
    flex-direction: row;
    padding: 32px;
    width: 100%;
    overflow: auto; 
  }

  .profile {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex: 2
  }

  .contact {
    display: flex;
    flex-direction: column;
    align-items: flex-begin;
    flex: 3
  }

  .registry {
    display: flex;
    flex-direction: row;
    padding-bottom: 8px;
  }

  .search {
    padding-right: 6px;
  }

  .logo {
    width: 100%;
    height: 192px;
    width: 192px;
    border: 1px solid #dddddd;
    border-radius: 8px;
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
  }

  .avatar {
    color: #888888;
    height: 192px;
    font-size: 8em;
    display: flex;
    justify-content: flex-end;
  }

  .logoedit {
    align-self: flex-end;
    font-size: 16px;
    position: relative;
    padding-right: 8px;
    cursor: pointer;
    background: #f6f5ed;
    padding-left: 8px;
    border-radius: 4px;
    border: 1px solid #dddddd;
    z-index: 10;
    left: 192px;
  }

  .detailedit {
    font-size: 16px;
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

export const ModalFooter = styled.div`
  width: 100%;
  display: flex;

  .select {
    display: flex;
    flex-grow: 1;
  }
`

export const CloseButton = styled(Button)`
  font-size: 24px;
  color: white;
`;

export const EditIcon = styled(EditOutlined)`
    color: #1890ff;
`;

