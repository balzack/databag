import { Button, List } from 'antd';
import styled from 'styled-components';

export const CardsWrapper = styled.div`
  position: relative;
  height: calc(100vh - 127px);
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;;
  text-align: center;
  padding-top: 16px;
`;

export const CardItem = styled(List.Item)`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 4px;
  padding-bottom: 4px;
  cursor: pointer;
  &:hover {
    background-color: #eeeeee;
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

