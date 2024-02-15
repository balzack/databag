import styled from 'styled-components';

export const IdentityWrapper = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  background-color: ${props => props.theme.headerArea};
  border-bottom: 1px solid ${props => props.theme.sectionLine};
  color: ${props => props.theme.mainText};
  flex-shrink: 0;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.hoverArea};

    .drop {
      font-weight: bold;
    }
  }

  .drop {
    padding-left: 4px;
    padding-right: 4px;
    border-radius: 8px;
    border: 1px solid ${props => props.theme.sectionLine};
    color: ${props => props.theme.mainText};
  }

  .label {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 16px;
    min-width: 0;

    .name {
      font-size: 14px;
    }

    .handle {
      font-size: 12px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-weight: bold;

      .notice {
        width: 32px;
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
    }
  }
`;

export const LogoutContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  .logoutMode {
    padding-right: 8px;
    color: ${props => props.theme.mainText};
  }
`

export const ErrorNotice = styled.div`
  color: ${props => props.theme.alertText};
`

export const InfoNotice = styled.div`
  color: ${props => props.theme.linkText};
`

