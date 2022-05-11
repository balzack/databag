import styled from 'styled-components';

export const AudioAssetWrapper = styled.div`
  position: relative;
  height: 100%;

  .player {
    top: 0;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label {
    bottom: 0;
    position: absolute;
    width: 100%;
    overflow: hidden;
    text-align: center;
    color: white;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;


