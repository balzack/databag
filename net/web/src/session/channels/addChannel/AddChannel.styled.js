import styled from 'styled-components';
import Colors from 'constants/Colors';

export const AddChannelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .members {
    margin-top: 16px;
    width: 100%;
    padding-left: 8px;
    color: ${Colors.grey};
  }

  .list {
    width: 100%;
    min-height: 100px;
    max-height: 200px;
    overflow: scroll;
    border: 1px solid ${Colors.divider};
  }
`;


