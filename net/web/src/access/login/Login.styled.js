import styled from 'styled-components';

export const LoginWrapper = styled.div`
  max-width: 400px;
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;

  .disabled {
    background-color: ${props => props.theme.disabledArea};

    button {
      color: ${props => props.theme.idleText};
    }
  }

  .enabled {
    background-color: ${props => props.theme.enabledArea};

    button {
      color: ${props => props.theme.activeText};
    }
  }

  .app-title {
    font-size: 24px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex: 1;
    color: ${props => props.theme.hintText};

    .settings {
      color: ${props => props.theme.hintText};
      position: absolute;
      top: 0px;
      right: 0px;
      font-size: 20px;
      cursor: pointer;
      margin: 16px;
    }
  }

  .form-title {
    font-size: 32px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    flex-direction: column;
  }

  .form-message {
    font-size: 14px;
    padding-top: 8px;
    align-items: center;
    justify-content: center;
    font-weight: normal;
    text-align: center;
  }

  .form-form {
    flex: 2;
  
    .form-button {
      display: flex;
      align-items: center;
      justify-content: center;

      .form-login {
        width: 50%;
      }
    }
  }

  .form-submit {
    background-color: #444444;
  }
`;


