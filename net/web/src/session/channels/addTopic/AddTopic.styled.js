import styled from 'styled-components';
import Colors from 'constants/Colors';

export const AddTopicWrapper = styled.div`

  .button {
    position: absolute;
    bottom: 32px;
    right: 32px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 4px;
    padding-bottom: 4px;
    background-color: ${Colors.primary};
    color: ${Colors.white};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .bar {
    height: 64px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${Colors.formBackground};
    border-top: 2px solid ${Colors.divider};

    .add {
      display: flex;
      flex-direction: row;
      background-color: ${Colors.primary};
      color: ${Colors.white};
      align-items: center;
      justify-content: center;
      padding-left: 16px;
      padding-right: 16px;
      border-radius: 4px;
      font-size: 18px;
      cursor: pointer;

      .label {
        padding-left: 8px;
      }
    }
  }
`;

