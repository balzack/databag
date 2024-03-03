import styled from 'styled-components';

export const AddTopicWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.selectedArea};
  color: ${props => props.theme.mainText};

  textarea {
    padding-left: 8px;
    background-color: ${props => props.theme.inputArea};
    border: 1px solid ${props => props.theme.sectionBorder};
    color: ${props => props.theme.mainText};
  }

  textarea::placeholder {
    color: ${props => props.theme.placeholderText};
  }

  .message {
    width: 100%;
    padding-left: 32px;
    padding-right: 32px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .assets {
    margin-top: 8px;
    height: 128px;
    overflow: auto;
  }

  .buttons {
    padding-left: 32px;
    padding-right: 32px;
    padding-bottom: 16px;
    width: 100%;
    display: flex;
    flex-direction: row; 
    align-items: center;
    
    .bar {
      border-left: 1px solid ${props => props.theme.sectionBorder};
      height: 36px;
      padding-right 8px;
      margin-left: 8px;
    }

    .button {
      display: flex;
      flex-align: center;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      cursor: pointer;
      border: 1px solid ${props => props.theme.sectionBorder};
      background-color: ${props => props.theme.inputArea};
      font-size: 18px;
      color: ${props => props.theme.descriptionText};
    }

    .space {
      margin-right: 8px;
    }

    .end {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }
`
