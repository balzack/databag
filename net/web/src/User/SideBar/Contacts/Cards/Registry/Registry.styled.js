import styled from 'styled-components';
import { List } from 'antd';

export const RegistryWrapper = styled.div`
  position: relative;
  text-align: center;
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;
  flex-direction: column;

  .local {
    display: flex;
    flex-directionL row;
    align-items: center;
    justify-content: center;
  
    .local-name {
      border: 1px solid rgb(221, 221, 221);
      height: 32px;
      display: flex;
      align-items: center;
      padding-right: 8px;
      padding-left: 8px;
      background-color: rgb(238, 238, 238);
    }
  }

  .contacts {
    flex-grow: 1
    background-color: #fefefe;
    border-radius-bottom-right: 8px;
    border-radius-bottom-left: 8px;
    height: calc(100vh - 175px);
    overflow: auto;
  }

  .item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .logo {
    width: 36px;
    height: 36px;
  }

  .username {
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    text-align: right;
    flex-grow: 1;
  }

  .name {
    font-size: 1em;
  }

  .handle {
    font-size: 0.9em;
    font-weight: bold;
  }

`;

export const RegistryItem = styled(List.Item)`
  padding-top: 4px;
  padding-bottom: 4px;
  cursor: pointer;
  &:hover {
    background-color: #f0f5e0;
  }
`;

