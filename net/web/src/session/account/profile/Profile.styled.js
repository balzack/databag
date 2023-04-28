import styled from 'styled-components';
import Colors from 'constants/Colors';

export const ProfileWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.profileForm};

  .middleHeader {
    margin-left: 16px;
    margin-right: 16px;
    height: 48px;
    border-bottom: 1px solid ${Colors.profileDivider};
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
      color: ${Colors.primary};
      cursor: pointer;
      padding-right: 16px;
    }
  }

  .rightHeader {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .section {
    width: 100%;
    color: ${Colors.grey};
    padding-top: 24px;
    font-size: 12px;
    display: flex;
    widtH: 75%;
    justify-content: center;
    border-bottom: 1px solid ${Colors.divider};
  }

  .logo {
    position: relative;
    width: 20vw;
    cursor: pointer;
    margin-left: 32px;
    margin-right: 32px;

    &:hover .edit {
      opacity: 1;
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
      color: ${Colors.link};
      background-color: ${Colors.white};
      opacity: 0.7;
    }
  }

  .midContent {
    min-height: 0;
    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 32px;
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

    .notset {
      font-style: italic;
      color: ${Colors.grey};
    }

    .name {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;

      &:hover .icon {
        border: 1px solid ${Colors.grey};
        background-color: ${Colors.white};
      }  

      .icon {
        padding-left: 4px;
        padding-right: 4px;
        border: 1px solid ${Colors.profileForm};
        border-raidus: 4px;
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
      align-items: center;
      padding-bottom: 8px;
  
      .data {
        padding-left: 8px;
      }
    }

    .description {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-bottom: 8px;

      .data {
        padding-left: 8px;
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
    color: ${Colors.white};
    background-color: ${Colors.primary};
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

