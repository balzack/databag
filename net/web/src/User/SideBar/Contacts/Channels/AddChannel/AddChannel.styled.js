import styled from 'styled-components';
import { Input, Spin } from 'antd';

export const ConversationWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const SelectItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const Description = styled(Input.TextArea)`
  margin-top: 16px;
`;

export const BusySpin = styled(Spin)`
  position: absolute;
  align-self: center;
  z-index: 10;
`

