import styled from 'styled-components';

export const TopicItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  &:hover .options {
    visibility: visible;
  }

  .topic-header {
    display: flex;
    flex-direction: row;
    margin-left: 16px;
    padding-left: 16px;
    margin-right: 16px;
    padding-top: 8px;
    border-top: 1px solid #dddddd;

    .avatar {
      height: 32px;
      width: 32px;
    }

    .info {
      display: flex;
      flex-direction: row;
      line-height: 1;
      padding-left: 8px;

      .comments {
        padding-left: 8px;
        cursor: pointer;
        color: #888888;
      }

      .set {
        font-weight: bold;
        color: #444444;
        padding-right: 8px;
      }
      .unset {
        font-weight: bold;
        font-style: italic;
        color: #888888;
        padding-right: 8px;
      }
      .unknown {
        font-style: italic;
        color: #aaaaaa;
        padding-right: 8px;
      }
    }
  }

  .options {
    position: absolute;
    top: 0;
    right: 0;
    visibility: hidden;

    .buttons {
      display: flex;
      flex-direction: row;
      border-radius: 4px;
      background-color: #eeeeee;
      border: 1px solid #555555;
      margin-top: 2px;

      .button {
        font-size: 14px;
        margin-left: 8px;
        margin-right: 8px;
        cursor: pointer;
      }
    }
  }

  .topic-assets {
    padding-top: 4px;
  }

  .message {
    padding-right: 16px;
    padding-left: 72px;
    white-space: pre-line;
    min-height: 4px;

    .editing {
      display: flex;
      flex-direction: column;
      border-radius: 4px;
      border: 1px solid #aaaaaa;
      width: 100%;

      .controls {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding-bottom: 8px;
        padding-right: 8px;
      }
    }
  }
`;


