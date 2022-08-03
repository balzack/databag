import styled from 'styled-components';
import Colors from 'constants/Colors';

export const LoginWrapper = styled.div`
  height: 100%;

  .full-layout {
    width: 100%;
    height: 100%; 
    border-radius: 4px;
    background: ${Colors.formBackground};
  }

  .split-layout {
    position: relative;
    left: 50%;
    width: 50%;
    height: 100%;
    border-radius: 4px;
    background: ${Colors.formBackground};
  }
`;
