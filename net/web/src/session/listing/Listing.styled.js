import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const ListingWrapper = styled.div`
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
    min-height: 48px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    flex-shrink: 0;

    .showfilter {
      color: ${Colors.disabled};
      font-size: 18px;
      padding-right: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;
    } 

    .hidefilter {
      color: ${Colors.enabled};
      font-size: 18px;
      padding-right: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;
    } 

    .params {
      flex-grow: 1;
    }

    .username {
      border: 1px solid ${Colors.divider};
      background-color: ${Colors.white};
      border-radius: 8px;
      margin-top: 4px;
    }

    .node {
      border: 1px solid ${Colors.divider};
      background-color: ${Colors.white};
      border-radius: 8px;
    }

    .inline {
      padding-left: 4px;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
`;
