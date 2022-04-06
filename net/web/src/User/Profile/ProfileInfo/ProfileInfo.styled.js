import { Input, TextArea, Spin } from 'antd';
import styled from 'styled-components';

export const ProfileInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

export const ProfileDescription = styled(Input.TextArea)`
  margin-top: 16px;
`;

export const ProfileInput = styled(Input)`
  margin-top: 16px;
`;

export const ProfileSpin = styled(Spin)`
  position: absolute;
  z-index: 10;
`;

