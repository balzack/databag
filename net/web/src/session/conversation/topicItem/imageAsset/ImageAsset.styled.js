import styled from 'styled-components';

export const ImageAssetWrapper = styled.div`
  position: relative;
  height: 100%;

  .viewer {
    top: 0;
    position: absolute;
  }

  .overlay {
    cursor: pointer;
    top: 0;
    position: absolute;
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

