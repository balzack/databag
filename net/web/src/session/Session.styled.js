import styled from 'styled-components';

export const SessionWrapper = styled.div`
  height: 100%;
  width: 100%;

  .reframe {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .desktop-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    .left {
      min-width: 256px;
      max-width: 384px;
      width: 20%;
      height: 100%;
      background-color: yellow; 
      display: flex;
      flex-direction: column;
    }
    .center {
      flex-grow: 1;
    }
    .right {
      min-width: 256px;
      max-width: 384px;
      width: 20%;
      height: 100%;
      background-color: yellow; 
      display: flex;
      flex-direction: column;
    }
  }

  .tablet-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    .left {
      min-width: 256px;
      max-width: 384px;
      width: 30%;
      height: 100%;
      background-color: yellow; 
      display: flex;
      flex-direction: column;
    }
    .center {
      flex-grow: 1;
    }
  }

  .mobile-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .top {
      flex-grow: 1;
      position: relative;
    }
    .bottom {
      height: 48px;
    }
  }
`;
