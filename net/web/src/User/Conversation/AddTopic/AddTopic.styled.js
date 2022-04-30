import { Spin } from 'antd';
import styled from 'styled-components';

export const AddTopicWrapper = styled.div`
  width: 100%;

  .container {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-bottom: 24px;
    border-top: 1px solid #dddddd;
  }

  .input {
    margin-top: 16px;
    padding-left: 16px;
    padding-right: 16px;
    width: 100%;
  }

  .buttons {
    padding-left: 16px;
    padding-right: 16px;
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  .option {
    padding-right: 4px;
    padding-top: 4px;
  }

  .send {
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
    align-items: center;
    padding-top: 4px;
  }
`;

export const BusySpin = styled(Spin)`
  display: flex;
  position: absolute;
  right: 64px;
  x-index: 10;
`;

