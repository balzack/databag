import styled from 'styled-components';
import Colors from 'constants/Colors';

export const ContactWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.profileForm};


  .header {
    margin-left: 16px;
    margin-right: 16px;
    height: 48px;
    border-bottom: 1px solid ${Colors.profileDivider};
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;

    .handle {
      font-size: 20px;
      font-weight: bold;
      flex-grow: 1;
      padding-left: 16px;
    }

    .close {
      font-size: 16px;
      color: ${Colors.primary};
      cursor: pointer;
      padding-right: 16px;
    }
  }

  .content {
    min-height: 0;
    width: 100%;
    overflow: scroll;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 32px;

    .logo {
      position: relative;
      width: 20vw;
      margin-right: 32px;
    }
  }

  .view {
    width: 100%;
    height: 100%;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .logo {
      position: relative;
      width: 80%;
      margin-bottom: 16px;
    }

    .section {
      width: 100%;
      color: ${Colors.grey};
      padding-top: 16px;
      font-size: 12px;
      display: flex;
      justify-content: center;
    }
  }

  .details {
    display: flex;
    flex-direction: column;

    .name {
      display: flex;
      flex-direction: row;
      align-items: center;
 
      .data {
        padding-right: 8px;
        font-size: 24px;
        font-weight: bold;
      }
    }

    .location {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-bottom: 8px;
  
      .data {
        padding-left: 8px;
      }
    }

    .description {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-bottom: 8px;

      .data {
        padding-left: 8px;
      }
    } 
  }
`

