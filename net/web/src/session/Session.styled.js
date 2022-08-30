import styled from 'styled-components';

export const SessionWrapper = styled.div`
  height: 100%;
  width: 100%;

  .reframe {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;

    .spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0,0,0,0.1);
      width: 100%;
      height: 100%;
    }
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
      display: flex;
      flex-direction: column;
      position: relative;
      min-height: 0;

      .bottom {
        height: calc(100% - 48px);
      }
    }
    .center {
      flex-grow: 1;
      position: relative;
    }
    .right {
      min-width: 256px;
      max-width: 384px;
      width: 20%;
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
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
      display: flex;
      flex-direction: column;
      position: relative;
      min-height: 0;

      .bottom {
        height: calc(100% - 48px);
      }
    }
    .right {
      flex-grow: 1;
      position: relative;

      .drawer {
        padding: 0px;
      }
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
      position: relative;
      box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.3);
    }
  }
`;
