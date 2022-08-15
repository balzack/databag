import styled from 'styled-components';
import Colors from 'constants/Colors';

export const ChannelsWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.formFocus};

  .view {
    min-height: 0;
    overflow: scroll;
    flex-grow: 1;
  }
 
  .search {
    padding: 12px;
    border-bottom: 1px solid ${Colors.divider};
    display: flex;
    flex-direction: row;

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
    }
  }

  .bar {
    height: 64px;
    width: 100%;
    display: flex;
    flex-shrink: 0;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${Colors.formBackground};
    border-top: 2px solid ${Colors.divider};
    padding-bottom: 16px;
    padding-top: 16px;
    position: relative;
  }

  .add {
    display: flex;
    flex-direction: row;
    background-color: ${Colors.primary};
    color: ${Colors.white};
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
