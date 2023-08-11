import styled from 'styled-components';
import Colors from 'constants/Colors';

export const BinaryFileWrapper = styled.div`
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

  .extension {
    font-size: 32px;
    color: ${Colors.white};
  }    

  .label {
    bottom: 0;
    position: absolute;
    width: 100%;
    overflow: hidden;
    text-align: center;
    color: white;
    background-color: #cccccc;
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


