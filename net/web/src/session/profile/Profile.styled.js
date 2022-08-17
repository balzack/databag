import styled from 'styled-components';
import Colors from 'constants/Colors';

export const ProfileWrapper = styled.div`
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
      cursor: pointer;

      &:hover .edit {
        opacity: 1;
      }
  
      .edit {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        width: 24px;
        height: 24px;
        bottom: 0;
        right: 0;
        color: ${Colors.link};
        background-color: ${Colors.white};
        opacity: 0.7;
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
      width: 60%;
      margin-bottom: 16px;
      cursor: pointer;

      &:hover .edit {
        opacity: 1;
      }

      .edit {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        width: 24px;
        height: 24px;
        bottom: 0;
        right: 0;
        color: ${Colors.link};
        background-color: ${Colors.white};
        opacity: 0.7;
      }
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

    .section {
      width: 100%;
      color: ${Colors.grey};
      padding-top: 24px;
      font-size: 12px;
      display: flex;
      justify-content: center;
    }

    .controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-top: 1px solid ${Colors.divider};
      border-radius: 4px;
      padding: 8px;
      width: 75%;
    }

    .link {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      color: ${Colors.primary};
      padding-top: 8px;
    
      .label {
        padding-left: 8px;
      }
    }

    .logout {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      color: ${Colors.white};
      background-color: ${Colors.primary};
      margin-top: 8px;
      padding: 8px;
      border-radius: 4px;
 
      .label {
        padding-left: 8px;
      }
    }
  }
`
export const EditImageFooter = styled.div`
  width: 100%;
  display: flex;

  .select {
    display: flex;
    flex-grow: 1;
  }
`

