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
    padding-left: 4px;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .fullscreen {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #000000;
    top: 0;
    left: 0;
    z-index: 2;
    cursor: pointer;

    .image {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }
`;

