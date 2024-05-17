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

export const MFAModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;

  .title {
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
  }

  .description {
    font-size: 1.0rem;
    padding-bottom: 8px;
  }

  .code {
    padding-top: 4px;
    border-bottom: 1px solid ${props => props.theme.sectionBorder};
  }

  .alert {
    height: 24px;
    color: ${props => props.theme.alertText};
  }

  .controls {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 16px;

    .saveDisabled {
      background-color: ${props => props.theme.disabledArea};

      button {
        color: ${props => props.theme.idleText};
      }
    }

    .saveEnabled {
      background-color: ${props => props.theme.enabledArea};

      button {
        color: ${props => props.theme.activeText};
      }
    }
  }
`
