import { Input, Button, Spin } from 'antd';
import styled from 'styled-components';

export const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background-color: #f6f5ed;
  webkit-touch-callout: none; 
    -webkit-user-select: none; 
     -khtml-user-select: none; 
       -moz-user-select: none; 
        -ms-user-select: none; 
            user-select: none; 

  .canvas {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    background-color: #8fbea7;
    align-items: center;
    justify-content: center;
  }

  .connect {
    position: absolute;
    width: 40%;
    height: 40%;
    object-fit: contain;
  }

  .page {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
`;
 
