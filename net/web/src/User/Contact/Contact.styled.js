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

  .container {
    display: flex;
    flex-direction: row;
    padding: 32px;
    width: 100%;
    overflow: auto; 
  }
`;

export const CloseButton = styled(Button)`
  font-size: 24px;
  color: #aaaaaa;
`;
