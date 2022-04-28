import styled from 'styled-components';

export const TopicItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-left: 8px;
  padding-right: 8px;

  .avatar {
    height: 32px;
    width: 32px;
  }

  .topic {
    display: flex;
    flex-direction: column;
    padding-left: 8px;
 
    .info {
      display: flex;
      flex-direction: row;
      .set {
        font-weight: bold;
        color: #444444;
      }
      .unset {
        font-weight: bold;
        font-style: italic;
        color: #888888;
      }
    }

    .message {
    }
  }
`;


