import styled from 'styled-components';
import Colors from 'constants/Colors';

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

export const ImageModalWrapper = styled.div`
  .frame {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${Colors.black};
    position: relative;
  }

  .thumb {
    opacity: 0.5;
    width: 100%;
    object-fit: contain;
  }

  .full {
    width: 100%;
    object-fit: contain;
    position: absolute;
  }

  .failed {
    position: absolute;
    color: white;
    border-radius: 8px;

    .ant-spin-dot-item {
      background-color: ${Colors.alert};
    }
  }

  .loading {
    position: absolute;
    color: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;

    .ant-spin-dot-item {
      background-color: ${Colors.white};
    }
  }
`;
