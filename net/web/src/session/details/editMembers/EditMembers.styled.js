import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const EditMembersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .list {
    width: 100%;
    min-height: 100px;
    max-height: 200px;
    overflow: auto;
    border: 1px solid ${Colors.divider};
  }

`
