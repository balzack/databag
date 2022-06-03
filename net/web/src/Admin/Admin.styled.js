import { Input } from 'antd';
import styled from 'styled-components';

export const AdminWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8fbea7;
  webkit-touch-callout: none; 
    -webkit-user-select: none; 
     -khtml-user-select: none; 
       -moz-user-select: none; 
        -ms-user-select: none; 
            user-select: none;

  .dashboard {
    width: 80%;
    min-width: 400px;
    max-width: 800px;
    max-height: 80%;
    background-color: #eeeeee;
    border-radius: 4px;
  }
`;

export const LoginWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .login {
    padding: 8px;
    display: flex;
    flex-direction: row;
    background-color: #eeeeee;
    border-radius: 4px;
  }
`;
 
export const TokenInput = styled(Input.Password)`
  width: 300px;
`;
