import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const IdentityWrapper = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  @media (prefers-color-scheme: light) {
    background-color: ${props => props.theme.light.headerArea};
    border-bottom: 1px solid ${props => props.theme.light.sectionLine};
    color: ${props => props.theme.light.mainText};
  }
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.theme.dark.headerArea};
    border-bottom: 1px solid ${props => props.theme.dark.sectionLine};
    color: ${props => props.theme.dark.mainText};
  }
  flex-shrink: 0;

  &:hover {
    cursor: pointer;
    @media (prefers-color-scheme: light) {
      background-color: ${props => props.theme.light.hoverArea};
    }
    @media (prefers-color-scheme: dark) {
      background-color: ${props => props.theme.dark.hoverArea};
    }

    .drop {
      font-weight: bold;
    }
  }

  .drop {
    padding-left: 4px;
    padding-right: 4px;
    border-radius: 8px;
    @media (prefers-color-scheme: light) {
      border: 1px solid ${props => props.theme.light.sectionLine};
      color: ${props => props.theme.light.mainText};
    }
    @media (prefers-color-scheme: dark) {
      border: 1px solid ${props => props.theme.dark.sectionLine};
      color: ${props => props.theme.dark.mainText};
    }
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
    @media (prefers-color-scheme: light) {
      color: ${props => props.theme.light.mainText};
    }
    @media (prefers-color-scheme: dark) {
      color: ${props => props.theme.dark.mainText};
    }
  }
`

export const ErrorNotice = styled.div`
  @media (prefers-color-scheme: light) {
    color: ${props => props.theme.light.alertText};
  }
  @media (prefers-color-scheme: dark) {
    color: ${props => props.theme.dark.alertText};
  }
`

export const InfoNotice = styled.div`
  @media (prefers-color-scheme: light) {
    color: ${props => props.theme.light.linkText};
  }
  @media (prefers-color-scheme: dark) {
    color: ${props => props.theme.dark.linkText};
  }
`

