import styled from 'styled-components/native';
import { Colors } from 'constants/Colors';

export const Wrapper = styled.View`
  width: 100%;
  height: 100%;
`

export const Container = styled.View`
  background-color: ${Colors.formBackground};
  border-radius: 4px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const Control = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  color: ${Colors.grey};
`

export const Title = styled.Text`
  width: 100%;
  text-align: center;
  fontSize: 24px;
  color: ${Colors.grey};
`

export const Spacer = styled.View`
  flex-grow: 1;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 100%;
`

export const Header = styled.Text`
  font-size: 32px;
  color: ${Colors.text};
`

