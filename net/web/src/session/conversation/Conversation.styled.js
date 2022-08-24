import styled from 'styled-components';
import Colors from 'constants/Colors';

export const ConversationWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.profileForm};

  .header {
    margin-left: 16px;
    margin-right: 16px;
    height: 48px;
    border-bottom: 1px solid ${Colors.profileDivider};
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;

    .title {
      font-size: 18px;
      font-weight: bold;
      flex-grow: 1;
      padding-left: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      min-width: 0;

      .label {
        padding-left: 8px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        min-width: 0;
      }

      .logo {
        flex-shrink: 0;
      }
    }

    .button {
      font-size: 18px;
      color: ${Colors.grey};
      cursor: pointer;
      padding-right: 16px;
      padding-left: 16px;
    }
  }

  .thread {
    flex-grow: 1;
    min-height: 0;
  }

  .divider {
    padding-left: 16px;
    padding-right: 16px;
    
    .line {
      border-top: 1px solid ${Colors.divider};
    }

    .progress-idle {
      border-top: 1px solid ${Colors.divider};
    }

    .progress-active {
      border-top: 1px solid ${Colors.primary};
    }
  }

  .topic {
    flex-shrink: 0;
  }
`
