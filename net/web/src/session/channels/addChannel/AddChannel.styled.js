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
    overflow: auto;
    border: 1px solid ${Colors.divider};
  }
`;

export const AddFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 8px;

  .seal {
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;

    .sealText {
      padding-left: 8px;
    }
  }
`

