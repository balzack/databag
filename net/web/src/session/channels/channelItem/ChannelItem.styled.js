import styled from 'styled-components';
import Colors from 'constants/Colors';

export const ChannelItemWrapper = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-align: center;
  border-bottom: 1px solid ${Colors.divider};

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
    flex-grow: 1;
  }

  .markup {
  }
`;
