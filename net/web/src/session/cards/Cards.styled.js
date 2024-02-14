import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const CardsWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.card};

  .view {
    min-height: 0;
    overflow: auto;
    flex-grow: 1;

    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      font-style: italic;
      color: ${Colors.grey};
      height: 100%;
    }
  }
  
  .search {
    border-bottom: 1px solid ${Colors.divider};
    display: flex;
    flex-direction: row;
    height: 48px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    padding-bottom: 8px;

    .sorted {
      color: ${Colors.enabled};
      font-size: 18px;
      padding-right: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .unsorted {
      color: ${Colors.disabled};
      font-size: 18px;
      padding-right: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }


    .filter {
      border: 1px solid ${Colors.divider};
      background-color: ${Colors.white};
      border-radius: 8px;
      flex-grow: 1;
    }

    .inline {
      padding-left: 8px;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .add {
        display: flex;
        flex-direction: row;
        color: ${Colors.white};
        background-color: ${Colors.primary};
        align-items: center;
        justify-content: center;
        padding-left: 16px;
        padding-right: 16px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        height: 100%;
        flex-shrink: 0;

        .label {
          padding-left: 8px;
        }
      }
    }

    .dismiss {
      font-size: 18px;
      color: ${Colors.text};
      cursor: pointer;
    }
  }

  .bar {
    height: 48px;
    width: 100%;
    display: flex;
    flex-shrink: 0;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${Colors.formBackground};
    border-top: 1px solid ${Colors.divider};
    padding-bottom: 12px;
    padding-top: 12px;
    position: relative;

    .add {
      display: flex;
      flex-direction: row;
      color: ${Colors.primary};
      align-items: center;
      justify-content: center;
      padding-left: 16px;
      padding-right: 16px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      height: 100%;
      flex-shrink: 0;

      .label {
        padding-left: 8px;
      }
    }
  }
`;
