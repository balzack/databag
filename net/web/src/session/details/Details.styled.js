import styled from 'styled-components';

export const DetailsWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.selectedArea};
  color: ${props => props.theme.mainText};

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

    .controls {
      padding-top: 16px;
      padding-bottom: 16px;
      display: flex;
      flex-direction: row;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: space-evenly;

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
  }

  .header {
    width: 100%;
    height: 48px;
    border-bottom: 1px solid ${props => props.theme.headerBorder};
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
      color: ${props => props.theme.hintText};
      cursor: pointer;
    }
  }

  .content {
    min-height: 0;
    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    padding-top: 32px;
    align-items: center;
    position: relative;
    min-height: 0;

    .label {
      padding-top: 16px;
      width: 100%;
      border-bottom: 1px solid ${props => props.theme.sectionBorder};
      padding-left: 16px;
    }

    .members {
      width: 100%;
      padding-left: 16px;
    }

    .button {
      border-radius: 4px;
      color: ${props => props.theme.activeText};
      background-color: ${props => props.theme.enabledArea};
      cursor: pointer;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .description {
      display: flex;
      flex-direction: row;
      margin-bottom: 32px;
      width: 100%;

      .logo {
        height: fit-content;
        flex-shrink: 0;
        width: 40%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }

      .stats {
        display: flex;
        flex-direction: column;
        padding-left: 16px;

        .edit {
          cursor: pointer;
        }

        .edit:hover {
          color: ${props => props.theme.linkText};
        }

        .subject {
          font-size: 18px;
          font-weight: bold;
          padding-right: 8px;
        }

        .host {
          font-size: 16px;
        }

        .created {
          font-size: 14px;
        }
    }
  }
`

