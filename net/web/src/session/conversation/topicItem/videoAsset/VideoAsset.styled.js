import styled from 'styled-components';

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
  .frame {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
  }

  .ant-spin-dot-item {
    background-color: white;
  }

  .spinner {
    position: absolute;
    color: white;
    border-radius: 8px;
  }
`;
