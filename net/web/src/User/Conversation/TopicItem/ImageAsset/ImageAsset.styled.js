import styled from 'styled-components';

export const ImageAssetWrapper = styled.div`
  position: relative;
  height: 100%;

  .viewer {
    top: 0;
    position: absolute;
  }

  .viewer:hover .overlay {
    visibility: visible;
  }

  .overlay {
    visibility: hidden;
    position: relative;
    background-color: black;
    opacity: 0.5;
  }

  .expand {
    padding-right: 2px;
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;

