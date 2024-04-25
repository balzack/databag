import styled from 'styled-components';

export const MemberOptionWrapper = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.mainText};

  .details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    justify-content: center;
    min-width: 0;

    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 15px;
    }

    .handle {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }
  }
`;
