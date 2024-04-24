import styled from 'styled-components';

export const VideoFileWrapper = styled.div`
  position: relative;
  height: 100%;

  .overlay {
    position: absolute;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;

    .seek {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .left-seek {
        width: 50%;
        display: flex;
        justify-content: flex-begin;
      }

      .right-seek {
        width: 50%;
        display: flex;
        justify-content: flex-end;
      }

      .icon {
        cursor: pointer;
      }
    }
  }
`;


