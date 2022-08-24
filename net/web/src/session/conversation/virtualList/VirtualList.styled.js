import styled from 'styled-components';

export const VirtualListWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;

  .rollview {
    width: 100%;
    height: 100%;

    /* hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .rollview::-webkit-scrollbar {
    display: none;
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
