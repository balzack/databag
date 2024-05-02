import styled from 'styled-components';

export const AccessWrapper = styled.div`
  height: 100%;
  color: ${props => props.theme.hintText};

  .footer {
    display: flex;
    gap: 32px;

    .option {
      gap: 8px;

      .label {
        font-size: 12px;
        padding: 4px;
      }
    }
  }

  .full-layout {
    width: 100%;
    height: 100%;
    padding: 8px;
    
    .center {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      background: ${props => props.theme.frameArea};
      display: flex;
      flex-direction: column;
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
      background-color: ${props => props.theme.splashArea};

      .splash {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .right {
      width: 50%;
      height: 100%;
      background: ${props => props.theme.frameArea};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
`;
