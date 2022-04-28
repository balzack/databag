import styled from 'styled-components';

export const AvatarWrapper = styled.div`
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
  display: flex;
  font-size: 24px;
  align-items: center;
  justify-content: center;

  .avatar {
    object-fit: contain;
    height: 100%;
  }
`;

