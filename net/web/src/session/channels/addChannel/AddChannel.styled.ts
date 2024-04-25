import styled from 'styled-components';

export const AddChannelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.modalArea};
  color: ${(props) => props.theme.mainText};

  .subject {
    width: 100%;

    input {
      padding-left: 8px;
      background-color: ${(props) => props.theme.inputArea};
      border: 1px solid ${(props) => props.theme.sectionBorder};
      color: ${(props) => props.theme.mainText};
    }

    input::placeholder {
      color: ${(props) => props.theme.placeholderText};
    }
  }

  .members {
    margin-top: 16px;
    width: 100%;
    padding-left: 8px;
    color: ${(props) => props.theme.labelText};

    .count {
      padding-left: 8px;
    }
  }

  .list {
    width: 100%;
    min-height: 100px;
    max-height: 200px;
    overflow: auto;
    border: 1px solid ${(props) => props.theme.sectionBorder};
  }
`;

export const AddFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 8px;

  .seal {
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;

    .sealText {
      padding-left: 8px;
    }
  }
`;
