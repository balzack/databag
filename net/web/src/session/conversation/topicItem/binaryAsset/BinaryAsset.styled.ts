import styled from 'styled-components';

export const BinaryAssetWrapper = styled.div`
  position: relative;
  height: 100%;

  .player {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #888888;
  }

  .background {
    height: 100%;
    object-fit: contain;
  }

  .unsealing {
    padding-left: 8px;
    padding-right: 8px;
    width: 64px;
    height: 16px;
  }

  .label {
    width: 100%;
    overflow: hidden;
    text-align: center;
    color: white;
    font-size: 14px;
    text-overflow: ellipsis;
    padding: 4px;
  }

  .control {
    width: 100%;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .extension {
    width: 100%;
    overflow: hidden;
    text-align: center;
    color: white;
    font-size: 24px;
  }
`;
