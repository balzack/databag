import styled from 'styled-components';
import Colors from 'constants/Colors';

export const ChannelItemWrapper = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${Colors.divider};
  padding-left: 16px;
  padding-right: 16px;

  &:hover {
    background-color: ${Colors.formHover};
    cursor: pointer;
  }

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid ${Colors.grey};
      width: 32px;
      height: 32px;
      border-radius: 8px;
      font-size: 18px;
    }

    .subject {
      padding-left: 16px;
      flex-grow: 1;
    }

    .markup {
    }
  }
`;
