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
      line-height: 1;

      .comments {
        padding-left: 8px;
        cursor: pointer;
        color: #888888;
      }

      .set {
        font-weight: bold;
        color: #444444;
        padding-right: 8px;
      }
      .unset {
        font-weight: bold;
        font-style: italic;
        color: #888888;
        padding-right: 8px;
      }
    }

    .message {
      padding-top: 6px;
    }
  }
`;


