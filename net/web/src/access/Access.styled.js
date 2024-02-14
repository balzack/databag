import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const AccessWrapper = styled.div`
  height: 100%;

  .full-layout {
    width: 100%;
    height: 100%;
    padding: 8px;
    
    .center {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      background: ${Colors.formBackground};
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .split-layout {
    display: flex;
    flex-direction: row;
    height: 100%;

    .left {
      width: 50%;
      height: 100%;
      padding: 32px;

      .splash {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .right {
      width: 50%;
      height: 100%;
      background: ${Colors.formBackground};
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
