import { Button, Space } from 'antd';
import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-left: 8px;
  padding-right: 8px;
  background-color: ${props => props.theme.baseArea};
  color: ${props => props.theme.hintText};
  
  .container {
    display: flex;
    flex-direction: column;
    padding-top: 16px;
    padding-left: 16px;
    padding-right: 16px;
    border-radius: 4px;
    max-width: 100%;
    max-height: 80%;
    background-color: ${props => props.theme.itemArea};

    .header {
      color: ${props => props.theme.hintText};
      display: flex;
      flex-direction: row;
      font-size: 20px;
      border-bottom: 1px solid ${props => props.theme.headerBorder};
    }

    .body {
      padding-top: 8px;
      min-height: 0;
      overflow: auto;
      border-bottom: 1px solid ${props => props.theme.headerBorder};
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

  .header {
    display: flex;
    justify-content: center;
    font-size: 1.2rem;
  }

  .control {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    gap: 16px;
  }

  .label {
    border-top: 1px solid ${Colors.divider};
    padding-top: 8px;
    margin-top: 8px;
  }

  .minHeight {
    min-height: 32px;
  }

  .field {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
`;

export const CreateLayout = styled.div`
  .header {
    display: flex;
    justify-content: center;
    font-size: 1.2rem;
  }

  .control {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    gap: 16px;
  }

  .url {
    display: flex;
    flex-direction: row;
    max-width: 100%;
    padding-top: 8px;

    .label {
      padding-right: 16px;
      width: 145px;
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

export const MFAModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;

  .title {
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    text-aling: center;
  }

  .description {
    font-size: 1.0rem;
    padding-bottom: 8px;
    text-align: center;
  }

  .secret {
    display: flex;
    flex-direction: row;
    gap: 8px;

    .label {
      font-weight: bold;
    }
  }

  .code {
    padding-top: 4px;
    border-bottom: 1px solid ${props => props.theme.sectionBorder};
  }

  .codeLabel {
    padding-top: 4px;
    font-size: 0.9.rem;
    color: ${props => props.theme.mainText};
  }

  .alert {
    height: 24px;
    color: ${props => props.theme.alertText};
  }

  .controls {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 16px;

    .saveDisabled {
      background-color: ${props => props.theme.disabledArea};

      button {
        color: ${props => props.theme.idleText};
      }
    }

    .saveEnabled {
      background-color: ${props => props.theme.enabledArea};

      button {
        color: ${props => props.theme.activeText};
      }
    }
  }
`
