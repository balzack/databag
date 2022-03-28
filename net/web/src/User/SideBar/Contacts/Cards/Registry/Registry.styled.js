import styled from 'styled-components';

export const RegistryWrapper = styled.div`
  position: relative;
  padding-left: 8px;
  padding-right: 8px;
  text-align: center;
  display: flex;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  flex-direction: column;

  .contacts {
    flex-grow: 1
    background-color: #fefefe;
    border-radius-bottom-right: 8px;
    border-radius-bottom-left: 8px;
  }
`;


