import styled from 'styled-components';
import Colors from 'constants/Colors';

export const DetailsWrapper = styled.div`
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
    padding-top: 32px;
    align-items: center;
    flex-grow: 1;
    position: relative;

    .label {
      padding-top: 16px;
      width: 100%;
      border-bottom: 1px solid ${Colors.divider};
      padding-left: 16px;
    }

    .members {
      width: 100%;
      min-height: 0;
      overflow: scroll;
      padding-left: 16px;
    }

    .button {
      width: 144px;
      padding: 4px;
      border-radius: 4px;
      color: ${Colors.white};
      background-color: ${Colors.primary};
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
          display: flex;
          flex-direction: row;
          align-items: center;
          cursor: pointer;
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
