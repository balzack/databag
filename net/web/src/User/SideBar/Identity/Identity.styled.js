import { Menu, Button, Dropdown } from 'antd';
import styled from 'styled-components';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const IdentityWrapper = styled.div`
  border-bottom: 1px solid #8fbea7;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  background-color: #f6f5ed;

  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 4px;
    padding-bottom: 4px;
    background-color: #f6f5ed;
  }

  .logo {
    width: 100%;
    height: 100%;
  }

  .username {
    white-space: nowrap;
    overflow: hidden;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    padding-right: 8px;
  }

  .avatar {
    color: #888888;
    font-size: 3em;
    width: 48px;
    height: 48px;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .name {
    font-size: 1.25em;
    color: #444444;
  }

  .handle {
    font-size: 1em;
    color: #444444;
    font-weight: bold;
  }

`;

export const AlertIcon = styled(ExclamationCircleOutlined)`
  color: red;
  margin-right: 6px;
`;

export const MenuWrapper = styled(Menu)`
  border-radius: 4px;
`;

export const IdentityDropdown = styled(Dropdown)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
`;
