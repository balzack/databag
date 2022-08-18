import styled from 'styled-components';
import Colors from 'constants/Colors';

export const AccountWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.statsForm};

  .header {
    width: 100%;
    height: 48px;
    border-bottom: 1px solid ${Colors.statsDivider};
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    padding: 16px;

    .label {
      flex-grow: 1;
      display: flex;
      justify-content: center;
    }

    .dismiss {
      font-size: 18px;
      color: ${Colors.text};
      cursor: pointer;
    }
  }

  .content {
    min-height: 0;
    width: 100%;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 32px;
    align-items: center;
    flex-grow: 1;

    .bottom {
      flex-grow: 1;
      display: flex;
      align-items: flex-end;
      padding-bottom: 16px;

      .link {
        color: ${Colors.primary};
        padding-top: 16px;
        padding-bottom: 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;    

        .label {
          padding-left: 8px;
        }
      }
    }
  }
    
`
