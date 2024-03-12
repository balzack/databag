import styled from 'styled-components';

export const ChannelItemWrapper = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.itemBorder};
  color: ${props => props.theme.mainText};
  line-height: 16px;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: ${props => props.theme.hoverArea};
  }

  .active {
    background-color: ${props => props.theme.selectedArea};
    width: 100%;
    height: 100%;
    display: flex;
    align-item: center;
  }

  .idle {
    width: 100%;
  }

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 0;
    padding-left: 16px;
    padding-right: 16px;

    .avatar{
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 18px;
      flex-shrink: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid ${props => props.theme.itemBorder};
      width: 32px;
      height: 32px;
      border-radius: 4px;
      font-size: 18px;
      flex-shrink: 0;
    }

    .details {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      padding-left: 16px;
      justify-content: center;
      min-width: 0;

      .subject {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .message {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: ${props => props.theme.hintText};
      }
    }
  }
`

export const Markup = styled.div`
  position: absolute;
  right: 0;
  border-radius: 8px;
  background-color: ${props => props.theme.noticeArea};
  width: 8px;
  height: 8px;
  margin-right: 16px;
`;
