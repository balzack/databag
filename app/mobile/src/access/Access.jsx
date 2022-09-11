import { SafeAreaView, View } from 'react-native';
import { Wrapper, Container, PaddedPane, Pane, Splash } from './Access.styled';
import { useAccess } from './useAccess.hook';
import { Login } from './login/Login';
import { Create } from './create/Create';
import { Reset } from './reset/Reset';
import logo from 'images/login.png'; 

export function Access({ mode }) {

  const { state, actions } = useAccess();

  return (
    <Wrapper>
      <SafeAreaView>
        { state.split === true && (
          <Container>
            <PaddedPane>
              <Splash source={logo} />
            </PaddedPane>
            <Pane>
              { mode === 'login' && (
                <Login />
              )}
              { mode === 'create' && (
                <Create />
              )}
              { mode === 'reset' && (
                <Reset />
              )}
            </Pane>
          </Container>
        )}
        { state.split === false && (
          <Container>
            { mode === 'login' && (
              <Login />
            )}
            { mode === 'create' && (
              <Create />
            )}
            { mode === 'reset' && (
              <Reset />
            )}
          </Container>
        )}
      </SafeAreaView>
    </Wrapper>
  );
}

