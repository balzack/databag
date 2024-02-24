import styled from 'styled-components';

export const AccountAccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 8px;
  width: 100%;
  background-color: ${props => props.theme.selectedArea};
  color: ${props => props.theme.mainText};

  .account {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 8px;
    width: fit-content;

    .control {
      min-width: 32px;
      display: flex;
      justify-content: flex-end;
    }

    .option {
      display: flex;
      padding-top: 8px;
      align-items: center;

      .label {
        padding-right: 16px;
        min-width: 130px;
        height: 28px;
        display: flex;
        align-items: center;
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .section {
    width: 100%;
    color: ${props => props.theme.hintText};
    padding-top: 24px;
    font-size: 12px;
    display: flex;
    widtH: 75%;
    justify-content: center;
    border-bottom: 1px solid ${props => props.theme.sectionBorder};
  }

  .switch {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 8px;
    padding-top: 8px;

    .switchEnabled {
      color: ${props => props.theme.activeArea};
      cursor: pointer;
    }

    .switchDisabled {
      color: ${props => props.theme.idleArea};
    }

    .switchLabel {
      padding-left: 8px;
      padding-right: 8px;
    }
  }

  .link {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    color: ${props => props.theme.linkText};
    padding-top: 8px;
    padding-bottom: 8px;
  
    .label {
      padding-left: 8px;
    }
  }
`;

export const SealModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .title {
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
  }

  .switch {
    display: flex;
    align-items: center;

    .switchLabel {
      color: ${props => props.theme.mainText};
      padding-left: 8px;
      padding-right: 8px;
    }
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

  .sealChange {
    width: 100%;
    background-color: ${props => props.theme.inputArea};
    color: ${props => props.theme.mainText};
    border-radius: 8px;
    position: relative;

    .ant-input-affix-wrapper {
      background-color: ${props => props.theme.inputArea};
    }

    .anticon {
      color: ${props => props.theme.placeholderText};

      &:hover {
        color: ${props => props.theme.linkText};
      }
    }

    input {
      padding-left: 8px;
      background-color: ${props => props.theme.inputArea};
      color: ${props => props.theme.mainText};
    }

    input::placeholder {
      color: ${props => props.theme.placeholderText};
    }
  }

  .editPassword {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`

export const LoginModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .title {
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
  }

  .loginValue {
    background-color: ${props => props.theme.inputArea};
    color: ${props => props.theme.mainText};
    border: 1px solid ${props => props.theme.sectionBorder};

    .anticon {
      color: ${props => props.theme.placeholderText};

      &:hover {
        color: ${props => props.theme.linkText};
      }
    }
  }

  input {
    padding-left: 8px;
    background-color: ${props => props.theme.inputArea};
    border: 1px solid ${props => props.theme.sectionBorder};
    color: ${props => props.theme.mainText};
  }

  input::placeholder {
    color: ${props => props.theme.placeholderText};
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

    .select {
      display: flex;
      flex-grow: 1;
    }
  }
`

