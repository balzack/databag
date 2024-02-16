import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const ChannelsWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.itemArea};

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
    height: 48px;

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

    .inline {
      padding-left: 8px;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      align-items: center;
      justify-content: center;
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
    background-color: ${props => props.theme.headerArea};
    border-top: 1px solid ${props => props.theme.sectionBorder};
    padding-bottom: 10px;
    padding-top: 10px;
    position: relative;
  }

  .addDisabled {
    background-color: ${props => props.theme.disabledArea};

    button {
      color: ${props => props.theme.idleText};
    }
  }

  .addEnabled {
    background-color: ${props => props.theme.enabledArea};

    button {
      color: ${props => props.theme.activeText};
    }
  }

  .adding {
    display: flex;
    flex-direction: row;
    background-color: ${props => props.theme.enabledArea};
    color: ${props => props.theme.activeText};
    align-items: center;
    justify-content: center;
    padding-left: 16px;
    padding-right: 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    height: 100%;

    .label {
      padding-left: 8px;
    }
  }
`;

