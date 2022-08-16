import styled from 'styled-components';
import Colors from 'constants/Colors';

export const ChannelItemWrapper = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${Colors.itemDivider};
  padding-left: 16px;
  padding-right: 16px;
  line-height: 16px;

  &:hover {
    background-color: ${Colors.formHover};
    cursor: pointer;
  }

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 0;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid ${Colors.grey};
      width: 32px;
      height: 32px;
      border-radius: 8px;
      font-size: 18px;
      flex-shrink: 0;
    }

    .details {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      padding-left: 16px;
      justify-content: center;
      min-width: 0;

      .subject {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .message {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: ${Colors.disabled};
      }
    }

    .markup {
      position: absolute;
      right: 0;
      border-radius: 8px;
      background-color: ${Colors.background};
      width: 8px;
      height: 8px;
      margin-right: 16px;
    }
  }
`;
