import styled from 'styled-components/native';
import { Colors } from 'constants/Colors';

export const Wrapper = styled.View`
  background-color: ${Colors.background};
  width: 100%;
  height: 100%;
`

export const Container = styled.View`
  padding: 16px;
  display: flex;
  flex-direction: row;
`

export const Splash = styled.Image`
  flex: 1;
  width: null;
  height: null;
  resize-mode: contain;
`

export const Pane = styled.View`
  width: 50%;
  height: 100%;
`

export const PaddedPane = styled.View`
  width: 50%;
  height: 100%;
  padding-right: 16px;
`
