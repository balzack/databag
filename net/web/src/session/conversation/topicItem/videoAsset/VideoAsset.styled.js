import styled from 'styled-components';
import Colors from 'constants/Colors';

export const VideoAssetWrapper = styled.div`
  position: relative;
  height: 100%;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const VideoModalWrapper = styled.div`

  .wrapper {
    padding-bottom: 6px;
  }

  .frame {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
  }

  .thumb {
    opacity: 0.3;
    width: 100%;
    object-fit: contain;
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
