import styled from 'styled-components';
import Colors from 'constants/Colors';

export const AccountAccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .link {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    color: ${Colors.primary};
    padding-top: 8px;
  
    .label {
      padding-left: 8px;
    }
  }
`;

export const EditFooter = styled.div`
  width: 100%;
  display: flex;

  .select {
    display: flex;
    flex-grow: 1;
  }
`

