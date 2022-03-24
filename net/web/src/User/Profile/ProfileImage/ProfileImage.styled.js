import { Spin } from 'antd';
import styled from 'styled-components';

export const ProfileImageWrapper = styled.div`
  position: relative;
  height: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProfileDefaultImage = styled.div`
  width: 192px;
  height: 192px;
  border: 1px solid #dddddd;
  border-radius: 8px;
  align-items: center;
  display: flex;
  justify-content: center;
  position: absolute;
  color: #888888;
  font-size: 6em;
  cursor: pointer;
`;

export const ProfileSpin = styled(Spin)`
  position: absolute;
  x-index: 10;
`;

