import styled from 'styled-components';

export const TopicItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-left: 8px;
  
  .avatar {
    height: 32px;
    width: 32px;
  }

  .topic {
    display: flex;
    flex-direction: column;
    padding-left: 8px;
    flex-grow: 1;

    &:hover .options {
      visibility: visible;
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
 
    .info {
      display: flex;
      flex-direction: row;
      line-height: 1;

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

    .message {
      padding-top: 6px;
      padding-right: 16px;
      white-space: pre-line;

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
  }
`;


