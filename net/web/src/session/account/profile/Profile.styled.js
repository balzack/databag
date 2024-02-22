import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const ProfileWrapper = styled.div`
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.selectedArea};
  color: ${props => props.theme.mainText};

  .middleHeader {
    margin-left: 16px;
    margin-right: 16px;
    height: 48px;
    border-bottom: 1px solid ${props => props.theme.sectionBorder};
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;

    .handle {
      font-size: 20px;
      font-weight: bold;
      flex-grow: 1;
      padding-left: 16px;
    }

    .close {
      font-size: 16px;
      color: ${props => props.theme.hintText};
      cursor: pointer;
      padding-right: 16px;
    }
  }

  .rightHeader {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    .title {
      font-size: 18px;
      font-weight: bold;
      padding-top: 16px;
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

  .logo {
    position: relative;
    width: 256px;
    height: 256px;
    flex-shrink: 0;
    cursor: pointer;
    margin-left: 32px;
    margin-right: 32px;

    &:hover .edit {
      color: ${props => props.theme.linkText};
      background-color: ${props => props.theme.iconArea};
    }

    .edit {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top-left-radius: 4px;
      border-bottom-right-radius: 4px;
      width: 24px;
      height: 24px;
      bottom: 0;
      right: 0;
      color: ${props => props.theme.hintText};
      background-color: ${props => props.theme.disabledArea};
    }
  }

  .midContent {
    min-height: 0;
    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 64px;
    padding-left: 32px;
    align-items: center;
  }

  .rightContent {
    min-height: 0;
    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 4px;
    padding: 8px;
  }

  .details {
    display: flex;
    flex-direction: column;
    padding-top: 16px;
    padding-left: 16px;
    padding-right: 16px;

    .notset {
      font-style: italic;
      color: ${props => props.theme.hintText};
    }

    .name {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      cursor: pointer;
      justify-content: center;

      &:hover .icon {
        color: ${props => props.theme.linkText};
      }  

      .icon {
        padding-left: 4px;
        padding-right: 4px;
        color: ${props => props.theme.hintText};
      }

      .data {
        padding-right: 4px;
        font-size: 24px;
        font-weight: bold;
      }
    }

    .location {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding-bottom: 8px;
      padding-top: 8px;
  
      .data {
        padding-left: 8px;
        margin-top: -4px;
      }
    }

    .description {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding-top: 8px;

      .data {
        padding-left: 8px;
        margin-top: -4px;
      }
    } 
  }

  .account {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    width: 75%;
  }

  .logout {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    color: ${props => props.theme.mainText};
    background-color: ${props => props.theme.modalArea};
    margin-top: 8px;
    padding: 8px;
    border-radius: 4px;

    .label {
      padding-left: 8px;
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
export const ProfileDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .info {
    width: 100%;
    padding: 8px;
  }
`;

export const ProfileImageWrapper = styled.div`
  position: relative;
  height: 256px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

