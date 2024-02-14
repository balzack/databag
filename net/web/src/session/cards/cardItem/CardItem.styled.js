import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const CardItemWrapper = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${Colors.divider};
  padding-left: 16px;
  padding-right: 16px;

  &:hover {
    background-color: ${Colors.formHover};
    cursor: pointer;
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
    }
  }

  .markup {
    position: absolute;
    right: 0;
    margin-right: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
  }
`;

export const StatusError = styled.div`
  color: ${Colors.error};
  font-size: 14px;
  padding-right: 12px;
`

export const ComOptions = styled.div`
  color: ${Colors.primary};
  font-size: 16px;
  display: flex;
  flex-direction: row;

  .option {
    padding-right: 12px;
    cursor: pointer;
  }
`

export const StatusConnected = styled.div`
  background-color: ${Colors.connected};
  border-radius: 8px;
  width: 8px;
  height: 8px;
`;

export const StatusConnecting = styled.div`
  background-color: ${Colors.connecting};
  border-radius: 8px;
  width: 8px;
  height: 8px;
`;

export const StatusRequested = styled.div`
  background-color: ${Colors.requested};
  border-radius: 8px;
  width: 8px;
  height: 8px;
`;

export const StatusPending = styled.div`
  background-color: ${Colors.pending};
  border-radius: 8px;
  width: 8px;
  height: 8px;
`;

export const StatusConfirmed = styled.div`
  background-color: ${Colors.confirmed};
  border-radius: 8px;
  width: 8px;
  height: 8px;
`;


