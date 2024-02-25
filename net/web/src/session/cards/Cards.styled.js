import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const CardsWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.itemArea};
  color: ${props => props.theme.mainText};

  .view {
    min-height: 0;
    overflow: auto;
    flex-grow: 1;

    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      font-style: italic;
      color: ${props => props.theme.hintText};
      height: 100%;
    }
  }
  
  .search {
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
    border-bottom: 1px solid ${props => props.theme.sectionBorder};
    display: flex;
    flex-direction: row;

    .filter { 
      border: 1px solid ${props => props.theme.sectionBorder};
      background-color: ${props => props.theme.inputArea};
      border-radius: 8px;
      flex-grow: 1;

      .filterControl {
        color: ${props => props.theme.mainText};

        input {
          padding-left: 4px;
          color: ${props => props.theme.mainText};
        }

        input::placeholder {
          color: ${props => props.theme.placeholderText};
        }
      }
    }

    .dismiss {
      font-size: 18px;
      color: ${props => props.theme.hintText};
      cursor: pointer;
    }

    .sorted {
      color: ${props => props.theme.mainText};
      font-size: 18px;
      padding-right: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .unsorted {
      color: ${props => props.theme.hintText};
      font-size: 18px;
      padding-right: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;
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

      .anticon {
        color: ${props => props.theme.enabledText};
      }
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
    background-color: ${props => props.theme.enabledArea};
    border-top: 1px solid ${props => props.theme.sectionBorder};
    padding-bottom: 12px;
    padding-top: 12px;
    position: relative;

    .add {
      display: flex;
      flex-direction: row;
      color: ${props => props.theme.mainText};
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
