import styled from 'styled-components';

export const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  padding-right: 8px;
  overflow: hidden;
  color: #444444;

  .subject {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
  }

  .host {
    text-align: right;
  }
`;
