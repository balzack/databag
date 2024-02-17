import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const SelectItemWrapper = styled.div`
  color: ${props => props.theme.mainText};

  .active {
    cursor: pointer;
    height: 48px;
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
    display: flex;
    align-items: center;

    &:hover {
      background-color: ${props => props.theme.hoverArea};
    }
  }

  .passive {
    height: 48px;
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
    display: flex;
    align-items: center;
  }

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
      color: ${props => props.theme.hintText};
    }
  }

  .switch {
    flex-shrink: 0;
    padding-right: 8px;
  }
`

export const Markup = styled.div`
  background-color: ${Colors.connected};
  border-radius: 8px;
  width: 8px;
  height: 8px;
  margin-right: 8px;
`;

