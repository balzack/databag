import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const AudioAssetWrapper = styled.div`
  position: relative;
  height: 100%;

  .player {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #aaaaaa;
  }

  .background {
    height: 100%;
    object-fit: contain;
  }

  .label {
    top: 0;
    position: absolute;
    width: 100%;
    overflow: hidden;
    text-align: center;
    color: white;
  }

  .control {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const AudioModalWrapper = styled.div`
  width: 256px;
  height: 256px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #aaaaaa;

  .background {
    width: 256px;
    height: 256px;
  }

  .control {
    position: absolute;
  }

  .label {
    padding-top: 8px;
    position: absolute;
    top: 0;
    font-size: 20px;
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
