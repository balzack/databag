import styled from 'styled-components';
import Colors from 'constants/Colors';

export const AddTopicWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .message {
    width: 100%;
    padding-left: 32px;
    padding-right: 32px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .assets {
    padding-top: 8px;
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
      border-left: 1px solid ${Colors.encircle};
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
