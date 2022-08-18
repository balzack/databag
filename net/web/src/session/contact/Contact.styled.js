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
      font-size: 18px;
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
  }

  .view {
    width: 100%;
    height: 100%;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      display: flex;
      width: 100%;
      flex-direction: row;
      font-size: 18px;
      padding-top: 8px;
      padding-bottom: 32px;

      .handle {
        flex-grow: 1;
        font-weight: bold;
        display: flex;
        justify-content: center;
      }

      .close {
        color: ${Colors.primary};
        cursor: pointer;
        width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .logo {
      position: relative;
      width: 50%;
      margin-bottom: 16px;
    }

    .details {
      display: flex;
      flex-direction: column;
      align-items: center;

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
  }

  .controls {
    padding-top: 16px;
    padding-bottom: 16px;

    .button {
      width: 192px;
      padding-top: 2px;
      padding-bottom: 2px;
      margin-top: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      color: ${Colors.white};
      background-color: ${Colors.primary};
    }

    .label {
      flex-grow: 1;
      display: flex;
      justify-content: center;
    }

    .idle {
      cursor: pointer;
      opactiy: 0;
    }

    .busy {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .footer {
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 16px;
    color: ${Colors.grey};
  }
`

