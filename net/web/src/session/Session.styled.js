import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const RingingWrapper = styled.div`
  .ringing-list {
    padding: 4px;
    display: flex;
    flex-direction: column;
    background-color: ${Colors.darkBackground};

    .ringing-entry {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 8px;

      .ringing-accept {
        color: ${Colors.primary};
        font-size: 18;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${Colors.white};
        border-radius: 16px;
        margin: 8px;
        cursor: pointer;
      }

      .ringing-ignore {
        color: ${Colors.grey};
        font-size: 18;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${Colors.white};
        border-radius: 16px;
        margin: 8px;
        cursor: pointer;
      }
    
      .ringing-decline {
        color: ${Colors.alert};
        font-size: 18;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${Colors.white};
        border-radius: 16px;
        margin: 8px;
        transform: rotate(224deg);
        cursor: pointer;
      }

      .ringing-name {
        font-size: 16px;
        flex-grow: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        justify-content: center;
        color: ${Colors.white};
      }
    }
  }
}
`;

export const CallingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover .calling-hovered {
    display: flex;
  }
  
  .calling-local {
    width: 33%;
    bottom: 16px;
    left: 16px;
    position: absolute;
  }

  .calling-logo {
    position: absolute;
    top: 0;
    left: 0;
    width: 256px;
    height: 256px;
    background-color: yellow;
  }

  .calling-end {
    position: absolute;
    bottom: 16px;
    color: ${Colors.white};
    font-size: 24px;
    background-color: ${Colors.alert};
    display: none;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 20px;
    cursor: pointer;
    transform: rotate(135deg);
  }

  .calling-options {
    display: none;
    position: absolute;
    top: 16px;
    flex-direction: row;
  }

  .calling-option {
    color: ${Colors.white};
    font-size: 24px;
    background-color: ${Colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 20px;
    cursor: pointer;
    margin-left: 8px;
    margin-right: 8px;
  }
`;


export const SessionWrapper = styled.div`
  height: 100%;
  width: 100%;

  .reframe {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .spinner {
    position: absolute;
    width: 100%;
    height: calc(100% - 48px);
    z-index: 2;
    margin-top: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.1);
    widtH: 100%;
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
      max-width: 400px;
      width: 24%;
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
