import { Button, Space } from 'antd';
import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-left: 8px;
  padding-right: 8px;
  
  .container {
    display: flex;
    flex-direction: column;
    padding-top: 16px;
    padding-left: 16px;
    padding-right: 16px;
    border-radius: 4px;
    max-width: 100%;
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
      justify-content: center;
      width: 40px;
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

export const CreateLayout = styled.div`
  .url {
    display: flex;
    flex-direction: row;
    max-width: 100%;
   
    .link {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      flex-grow: 1;
      min-width: 0;
      padding-right: 8px;
    }
  }
`
