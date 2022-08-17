import styled from 'styled-components';
import Colors from 'constants/Colors';

export const ListingItemWrapper = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${Colors.divider};
  padding-left: 16px;
  padding-right: 16px;

  &:hover {
    background-color: ${Colors.formHover};
    cursor: pointer;
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
`

