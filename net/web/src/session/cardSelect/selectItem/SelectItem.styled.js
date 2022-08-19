import styled from 'styled-components';
import Colors from 'constants/Colors';

export const SelectItemWrapper = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${Colors.selectHover};
  }

  .details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    justify-content: center;
    min-width: 0;

    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 15px;
    }

    .handle {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }
  }

  .switch {
    flex-shrink: 0;
  }
`
