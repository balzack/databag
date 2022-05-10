import styled from 'styled-components';

export const LabelWrapper = styled.div`
  display: flex;
  width: calc(100% - 48px);
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  overflow: hidden;
  color: #444444;

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;

    .subject {
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: right;
      padding-right: 8px;
      font-weight: bold;
    }
  }

  .message {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
    padding-right: 8px;
    color: #888888;
  }

`;
