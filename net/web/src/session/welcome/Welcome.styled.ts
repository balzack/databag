import styled from 'styled-components';

export const WelcomeWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.descriptionColor};
  background-color: ${(props) => props.theme.baseArea};

  .video {
    width: 640px;
    height: 480px;
    background-color: yellow;
  }

  .title {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    padding: 16px;
    color: ${(props) => props.theme.descriptionText};

    .header {
      font-weight: bold;
      font-size: 20px;
      color: ${(props) => props.theme.descriptionText};
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
    color: ${(props) => props.theme.descriptionText};
  }
`;
