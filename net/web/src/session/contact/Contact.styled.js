import styled from 'styled-components';

export const ContactWrapper = styled.div`
  height: 100%;
  width: 100%;

  .frame {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    color: ${props => props.theme.mainText};
  }

  .drawer {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-left: 1px solid ${props => props.theme.drawerBorder};
    background-color: ${props => props.theme.selectedArea};
    color: ${props => props.theme.mainText};
  }

  .actions {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    padding-top: 16px;
    flex-direction: column;
    align-items: center;

    .label {
      padding-top: 16px;
      border-bottom: 1px solid ${props => props.theme.sectionBorder};
      color: ${props => props.theme.hintText};
      font-size: 12px;
      width: 50%;
      max-width: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .top {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
  }

  .header {
    margin-left: 16px;
    margin-right: 16px;
    height: 48px;
    display: flex;
    border-bottom: 1px solid ${props => props.theme.headerBorder};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
 
     .handle {
       font-size: 20px;
       font-weight: bold;
       flex-grow: 1;
       padding-left: 16px;
     }


    .handle {
      font-size: 20px;
      font-weight: bold;
    }

    .close {
      font-size: 18px;
      color: ${props => props.theme.hintText};
      cursor: pointer;
      padding-right: 16px;
    }
  }

  .midContent {
    min-height: 0;
    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 32px;
  }

  .rightContent {
    min-height: 0;
    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    .details {
      align-items: center;
      padding-left: 16px;
      padding-right: 16px;
      max-width: 400px;
    }

    .logo {
      margin-top: 16px;
      margin-bottom: 8px;
    }
  }

  .logo {
    position: relative;
    width: 20vw;
    margin-right: 32px;
    margin-left: 32px;
    width: 192px;
    height: 192px;
  }

  .details {
    display: flex;
    flex-direction: column;

    .notset {
      font-style: italic;
      color: ${props => props.theme.hintText};
    }

    .name {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-bottom: 8px;
 
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

  .view {
    width: 100%;
    overflow: auto;
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
        color: ${props => props.theme.mainText};
        cursor: pointer;
        width: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .controls {
    padding-top: 16px;
    padding-bottom: 16px;
    display: flex;
    flex-direction: row;
    gap: 16px;

    .button {
      display: flex;
    }

    .anticon {
      font-size: 18px;
      padding-top: 2px;
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
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 16px;
    color: ${props => props.theme.hintText};
  }
`

