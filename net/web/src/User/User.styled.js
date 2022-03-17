import { Input, Button, Spin } from 'antd';
import styled from 'styled-components';

export const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background-color: #f6f5ed;

  .listing {
    width: 30%;
    height: 100%;
    max-width: 300px;
    min-width: 200px;
    border: 1px solid #8fbea7;
  }

  .canvas {
    display: flex;
    flex-grow: 1;
    height: 100%;
    border: 1px solid #8fbea7;
    align-items: center;
    justify-content: center;
  }

  .connect {
    width: 33%;
    height: 33%;
    object-fit: contain;
  }
`;
 
