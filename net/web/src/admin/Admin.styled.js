import styled from 'styled-components';
import Colors from 'constants/Colors';

export const AdminWrapper = styled.div`
  max-width: 400px;
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;

  .app-title {
    font-size: 24px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex: 1;
    color: ${Colors.grey};

    .user {
      color: ${Colors.grey};
      position: absolute;
      top: 0px;
      right: 0px;
      font-size: 20px;
      cursor: pointer;
      margin: 16px;
    }
  }
`;


