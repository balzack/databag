import styled from 'styled-components';
import { Colors } from 'constants/Colors';

export const AccountWrapper = styled.div`
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.selectedArea};
  color: ${props => props.theme.mainText};

  .header {
    width: 100%;
    height: 48px;
    border-bottom: 1px solid ${props => props.theme.sectionBorder};
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    padding: 16px;

    .label {
      flex-grow: 1;
      display: flex;
      justify-content: center;
    }

    .dismiss {
      font-size: 18px;
      color: ${props => props.theme.hintText};
      cursor: pointer;
    }
  }

  .content {
    min-height: 0;
    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 16px;
    align-items: center;
    flex-grow: 1;

    .bottom {
      flex-grow: 1;
      display: flex;
      align-items: flex-end;
      padding-bottom: 16px;

      .link {
        color: ${props => props.theme.linkText};
        padding-top: 16px;
        padding-bottom: 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;    

        .label {
          padding-left: 8px;
        }
      }
    }
  }
    
`
