import styled from 'styled-components';

export const MemberItemWrapper = styled.div`
  display: flex;
  width: 100%;
  background-color: #f6f5ed;
  flex-direction: row;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 2px;
  padding-bottom: 2px;
  align-items: center;
  border-bottom: 1px solid #eeeeee;

  .avatar {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
  }

  .label {
    padding-left: 8px;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .handle {
      font-size: 0.8em;
      font-weight: bold;
    }

    .name {
    }
  }
`;

