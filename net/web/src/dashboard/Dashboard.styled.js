import { Button, Space } from 'antd';
import styled from 'styled-components';
import Colors from 'constants/Colors';

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
    background-color: ${Colors.formBackground};

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

    .alert {
      display: flex;
      align-items: center;
      color: ${Colors.alert};
    }
  }
`;

export const AddButton = styled(Button)`
  color: #1890ff;
`;

export const SettingsButton = styled(Button)`
  color: #1890ff;
`;

export const AlertIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${Colors.alert};
  padding-left: 8px;
`

export const SettingsLayout = styled(Space)`
  width: 100%;

  .label {
    border-top: 1px solid ${Colors.divider};
    padding-top: 8px;
    margin-top: 8px;
  }

  .field {
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
    padding-top: 8px;

    .label {
      padding-right: 16px;
      width: 112px;
    }

    .token {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      min-width: 0;
      padding-right: 8px;
    }  
 
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
