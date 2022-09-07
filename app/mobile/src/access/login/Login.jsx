import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from 'react-native';
import { Wrapper, Container, Control, Title, Spacer, Header } from './Login.styled';

export function Login() {
  return (
    <Wrapper>
      <Container>
        <Control>
          <Ionicons name="md-cog" size={32} color="grey" />
        </Control>
        <Title>Databag</Title>
        <Spacer>
          <Header>Login</Header>
        </Spacer>
      </Container>
    </Wrapper>
  );
}
