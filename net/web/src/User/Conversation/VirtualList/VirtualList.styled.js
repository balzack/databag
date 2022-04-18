import styled from 'styled-components';

export const VirtualListWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f6f5ed;
  overflow: hidden;

  .rollview {
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }

  .roll {
    width: 100%;
    position: relative;
  }
`;

export const VirtualItem = styled.div`
  position: absolute;
  width: 100%;
  overflow: hidden;
`;
