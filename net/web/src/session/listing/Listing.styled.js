import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const ListingWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.itemArea};
  color: ${props => props.theme.mainText};

  .drawer {
    width: 100%;
    height: 100%;
    border-left: 1px solid ${props => props.theme.sectionBorder};
  }

  .screen {
    width: 100%;
    height: 100%;
  }

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
    border-bottom: 1px solid ${props => props.theme.sectionBorder};
    display: flex;
    flex-direction: row;
    min-height: 48px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    flex-shrink: 0;

    .showfilter {
      color: ${props => props.theme.hintText};
      font-size: 18px;
      padding-right: 16px;
      display: flex;
      align-items: center;
      cursor: pointer;
    } 

    .hidefilter {
      color: ${props => props.theme.mainText};
      font-size: 18px;
      padding-right: 16px;
      display: flex;
      align-items: center;
      cursor: pointer;
    } 

    .params {
      flex-grow: 1;
    }

    .node { 
      border: 1px solid ${props => props.theme.sectionBorder};
      background-color: ${props => props.theme.inputArea};
      border-radius: 8px;
      flex-grow: 1;

      .nodeControl {
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

      .anticon {
        color: ${props => props.theme.mainText};
      }
    }
  }
`;
