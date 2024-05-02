import { Button } from 'antd';
import styled from 'styled-components';

export const AccountItemWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 2px;
  padding-bottom: 2px;
  border-bottom: 1px solid ${props => props.theme.itemBorder};
  align-items: center;
  color: ${props => props.theme.mainText};

  &:hover {
    background-color: ${props => props.theme.hoverArea};
  }

  .avatar {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
  }

  .inactive {
    padding-left: 16px;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    color: #cccccc;
    min-width: 0;
  }

  .active {
    padding-left: 16px;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;
  }

  .handle {
    font-size: 0.8em;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .storage {
    color: ${props => props.theme.hintText};
    padding-left: 8px;
  }    

  .guid {
    font-size: 0.8em;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .control {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;

export const EnableButton = styled(Button)`
  color: orange;
`;

export const DisableButton = styled(Button)`
  color: orange;
`;

export const ResetButton = styled(Button)`
  color: #1890ff;
`;

export const DeleteButton = styled(Button)`
  color: red;
`

export const AccessLayout = styled.div`
  .control {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .header {
    display: flex;
    justify-content: center;
    font-size: 1.2rem;
  }

  .url {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-top: 8px;

    .label {
      padding-right: 16px;
      min-width: 145px;
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
