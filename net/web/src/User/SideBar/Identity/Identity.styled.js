import { Button } from 'antd';
import styled from 'styled-components';

export const IdentityWrapper = styled.div`
  background-color: #f6f5ed;
  border-bottom: 2px solid #8fbea7;
  border-top: 1px solid #8fbea7;
  border-left: 0px;
  border-right: 0px;
  border-radius: 0px;
  &:hover {
    cursor: pointer;
  }

  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-left: 16px;
    padding-right: 16px;
  }

  .menu {
    min-width: 0px;
  }

  .logo {
    width: 33%
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .username {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-right: 8px;
  }

  .edit {
    position: absolute;
    display: flex;
    align-items: flex-end;
    right: 0;
    bottom: 0;
  }

  .name {
    font-size: 1.25em;
    color: #444444;
  }

  .handle {
    font-size: 1em;
    color: #444444;
  }

  .domain {
    font-size: 1em;
    color: #444444;
  }
`;
