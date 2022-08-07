import styled from 'styled-components';
import Colors from 'constants/Colors';

export const BottomNavWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.formBackground};
  font-size: 24px;

  .nav-item {
    width: 33%;
    height: 100%;

    .nav-inactive {
      width: 100%;
      height: 100%;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .nav-active {
      width: 100%;
      height: 100%;
      background-color: ${Colors.formHover};
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .nav-div-right {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-right: 1px solid ${Colors.divider};
    }

    .nav-div-left {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-left: 1px solid ${Colors.divider};
    }

    .nav-button {
      cursor: pointer;
    }
  }
`;

