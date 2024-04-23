import styled from 'styled-components';

export const ChannelHeaderWrapper = styled.div`
  margin-left: 16px;
  margin-right: 16px;
  height: 48px;
  border-bottom: 1px solid ${props => props.theme.headerBorder};
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

    .label {
      color: ${props => props.theme.mainText};
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
    color: ${props => props.theme.hintText};
    cursor: pointer;
    padding-right: 16px;
    padding-left: 16px;
  }
`

export const StatusError = styled.div`
  color: ${props => props.theme.alertText};
  font-size: 14px;
  padding-left: 8px;
  cursor: pointer;
`
