import styled from 'styled-components';
import Colors from 'constants/Colors';

export const AddTopicWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .message {
    width: 100%;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .buttons {
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
    width: 100%;
    display: flex;
    flex-direction: row; 
    align-items: center;

    .button {
      display: flex;
      flex-align: center;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      cursor: pointer;
      border: 1px solid ${Colors.divider};
      background-color: ${Colors.white};
      font-size: 18px;
      color: ${Colors.enabled};
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
