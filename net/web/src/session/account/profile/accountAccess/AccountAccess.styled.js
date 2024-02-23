import styled from 'styled-components';
import { Colors } from 'constants/Colors';

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

    .option {
      display: flex;
      padding-top: 8px;
      align-items: center;

      .label {
        padding-right: 16px;
        min-width: 110px;
        height: 28px;
        display: flex;
        align-items: center;
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
  padding-bottom: 8px;

  .switch {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 8px;
    align-items: center;
    justify-content: center;
    padding-top: 8px;

    .switchLabel {
      color: ${props => props.theme.mainText};
      padding-left: 8px;
      padding-right: 8px;
    }
  }

  .sealPassword {
    padding-top: 4px;
    padding-bottom: 4px;
    position: relative;

    .editPassword {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
`

export const EditFooter = styled.div`
  width: 100%;
  display: flex;

  .select {
    display: flex;
    flex-grow: 1;
  }
`

