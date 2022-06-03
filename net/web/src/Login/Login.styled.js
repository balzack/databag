import { Input, Button, Spin } from 'antd';
import styled from 'styled-components';

export const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
\  
  .container {
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-radius: 4px;
    max-width: 500px;
    width: 50%;
  }

  .header {
    text-align: center;
    font-size: 2em;
    font-weight: bold;
    color: #555555
  }

  .subheader {
    font-size: 0.8em;
    display: flex;
    border-bottom: 1px solid black;
    color: #444444
    padding-left: 16px
    padding-right: 16px;
  }

  .subheader-text {
    text-align: center;
    width: 100%;
  }

  .settings {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 16px;
    color: #555555;
    font-size: 20px;
    cursor: pointer;
  }
`;

export const LoginInput = styled(Input)`
  margin-top: 16px;
`;

export const LoginPassword = styled(Input.Password)`
  margin-top: 16px;
`;

export const LoginEnter = styled(Button)`
  align-self: center;
  margin-top: 16px;
  min-width: 128px;
  width: 33%;
`;

export const LoginCreate = styled(Button)`
  margin-top: 4px;
`;

export const LoginSpin = styled(Spin)`
  position: absolute;
  z-index: 10;
`;
