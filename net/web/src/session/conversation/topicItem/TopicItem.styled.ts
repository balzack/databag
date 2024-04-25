import styled from 'styled-components';

export const TopicItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: ${(props) => props.theme.mainText};

  .topic-header {
    display: flex;
    flex-direction: row;
    margin-left: 16px;
    padding-left: 16px;
    margin-right: 16px;
    padding-top: 8px;
    border-top: 1px solid ${(props) => props.theme.itemBorder};

    &:hover .topic-options {
      visibility: visible;
    }

    .topic-options {
      visibility: hidden;
      padding-left: 16px;
      position: relative;
      top: -4px;

      .buttons {
        display: flex;
        flex-direction: row;
        border-radius: 4px;
        background-color: ${(props) => props.theme.modalArea};
        margin-top: 2px;

        .button {
          font-size: 14px;
          margin-left: 8px;
          margin-right: 8px;
          cursor: pointer;
        }

        .remove {
          color: ${(props) => props.theme.alertText};
        }

        .edit {
          color: ${(props) => props.theme.linkText};
        }
      }
    }

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
        color: ${(props) => props.theme.descriptionText};
      }

      .set {
        font-weight: bold;
        color: ${(props) => props.theme.mainText};
        padding-right: 8px;
      }
      .unset {
        font-weight: bold;
        font-style: italic;
        color: ${(props) => props.theme.descriptionText};
        padding-right: 8px;
      }
      .unknown {
        font-style: italic;
        color: #aaaaaa;
        padding-right: 8px;
      }
    }
  }

  .sealed-message {
    font-style: italic;
    color: ${(props) => props.theme.placeholderText};
    padding-left: 72px;
  }

  .asset-placeholder {
    width: 128px;
    height: 128px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.theme.frameArea};
    color: ${(props) => props.theme.placeholderText};
    margin-left: 72px;
  }

  .topic-assets {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .skeleton {
    height: 128px;
    margin-left: 72px;
    margin-right: 32px;
  }

  .message {
    padding-right: 16px;
    padding-left: 72px;
    white-space: pre-line;
    min-height: 4px;
    color: ${(props) => props.theme.mainText};
  }

  .editing {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.sectionBorder};
    background-color: ${(props) => props.theme.inputArea};
    margin-top: 8px;
    margin-bottom: 8px;
    margin-right: 16px;
    margin-left: 72px;

    textarea {
      padding-left: 8px;
      background-color: ${(props) => props.theme.inputArea};
      color: ${(props) => props.theme.mainText};
    }

    textarea::placeholder {
      color: ${(props) => props.theme.placeholderText};
    }

    .controls {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      padding-bottom: 8px;
      padding-right: 8px;
    }
  }
`;
