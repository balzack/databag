import styled from 'styled-components';

export const ListingItemWrapper = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${(params) => params.theme.itemBorder};
  color: ${(params) => params.theme.mainText};
  padding-left: 16px;
  padding-right: 16px;

  &:hover {
    background-color: ${(params) => params.theme.hoverArea};
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
`;
