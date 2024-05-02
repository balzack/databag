import styled from 'styled-components';

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
    border: 1px solid ${props => props.theme.sectionBorder};
    background-color: ${props => props.theme.itemArea};
  }

  .title {
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    padding-bottom: 16px;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding-top: 16px;
    width: 100%;
  }
`
