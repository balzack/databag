import styled from 'styled-components';
import { Input } from 'antd';

export const AudioFileWrapper = styled.div`
  position: relative;
  height: 100%;

  .square {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #444444;
  }
`;

export const LabelInput = styled(Input)`
  position: absolute;
  width: 100%;
  bottom: 0;
  text-align: center;
  color: white;
`

