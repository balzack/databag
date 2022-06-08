import { Button, Space } from 'antd';
import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  
  .container {
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    padding-top: 16px;
    padding-left: 16px;
    padding-right: 16px;
    border-radius: 4px;
    min-width: 800px;
    max-width: 900px;
    width: 50%;
    max-height: 80%;

    .header {
      color: #444444;
      display: flex;
      flex-direction: row;
      font-size: 20px;
      border-bottom: 1px solid #aaaaaa;
    }

    .body {
      padding-top: 8px;
      min-height: 0;
      overflow: auto;
      border-bottom: 1px solid #aaaaaa;
      margin-bottom: 16px;
    }

    .label {
      padding-right: 8px;
      padding-left: 4px;
      display: flex;
      align-items: center;
    }

    .settings {
      display: flex;
      align-items: center;
    }

    .add {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-grow: 1;
    }
  }
`;

export const AddButton = styled(Button)`
  color: #1890ff;
`;

export const SettingsButton = styled(Button)`
  color: #1890ff;
`;

export const SettingsLayout = styled(Space)`
  width: 100%;

  .host {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .storage {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;

export const CreateLayout = styled(Space)`
  white-space: nowrap;
`
