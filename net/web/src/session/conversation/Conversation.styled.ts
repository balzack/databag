import styled from 'styled-components';

export const ConversationWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.selectedArea};

  .header {
    margin-left: 16px;
    margin-right: 16px;
    height: 48px;
    border-bottom: 1px solid ${(props) => props.theme.headerBorder};
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;

    .title {
      font-size: 18px;
      font-weight: bold;
      flex-grow: 1;
      padding-left: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      min-width: 0;
      color: ${(props) => props.theme.mainText};

      .label {
        padding-left: 8px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        min-width: 0;
      }

      .logo {
        flex-shrink: 0;
      }
    }

    .button {
      font-size: 18px;
      color: ${(props) => props.theme.hintText};
      cursor: pointer;
      padding-right: 16px;
      padding-left: 16px;
    }
  }

  .thread {
    position: relative;
    flex-grow: 1;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse;

    .empty {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20;
      color: ${(props) => props.theme.hintText};
    }

    .loading {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      left: 0;
    }
  }

  .divider {
    padding-left: 16px;
    padding-right: 16px;
    
    .line {
      border-top: 1px solid ${(props) => props.theme.itemBorder};
    }

    .progress-idle {
      border-top: 1px solid ${(props) => props.theme.itemBorder};
      height: 1px;
    }

    .progress-active {
      border-top: 1px solid ${(props) => props.theme.linkText};
      height: 1px;
    }

    .progress-error {
      border-top: 1px solid ${(props) => props.theme.alertText};
      width: 100%;
      height: 1px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .topic {
    flex-shrink: 0;
    position: relative;

    .upload-error {
      position: absolute;
      top: 0;
      right: 0;
      margin-right: 16px;
      cursor-pointer;
    }
  }
`;

export const StatusError = styled.div`
  color: ${(props) => props.theme.alertText};
  font-size: 14px;
  padding-left: 8px;
  cursor: pointer;
`;
