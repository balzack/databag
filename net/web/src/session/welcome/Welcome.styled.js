import styled from 'styled-components';
import Colors from 'constants/Colors';

export const WelcomeWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #555555;

  .title {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    padding: 16px;

    .header {
      font-weight: bold;
      font-size: 20px;
    }
  }

  .session {
    width: 100%;
    object-fit: contain;
    display: flex;
    align-items: center;
    min-height: 0;
    opacity: 0.3;
  }

  .message {
    width: 100%;
    display: flex;
    flex-row: column;
    align-items: center;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    padding: 16px;
  }
`

