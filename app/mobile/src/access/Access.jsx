import { SafeAreaView, Image, View } from 'react-native';
import { styles } from './Access.styled';
import { useAccess } from './useAccess.hook';
import { Login } from './login/Login';
import { Create } from './create/Create';
import { Reset } from './reset/Reset';
import logo from 'images/login.png'; 

export function Access({ mode }) {

  const { state, actions } = useAccess();

  return (
    <View style={styles.wrapper}>
      <SafeAreaView>
        { state.split === true && (
          <View style={styles.container}>
            <View style={styles.paddedPane}>
              <Image style={styles.splash} source={logo} />
            </View>
            <View style={styles.pane}>
              { mode === 'login' && (
                <Login />
              )}
              { mode === 'create' && (
                <Create />
              )}
              { mode === 'reset' && (
                <Reset />
              )}
            </View>
          </View>
        )}
        { state.split === false && (
          <View style={styles.container}>
            { mode === 'login' && (
              <Login />
            )}
            { mode === 'create' && (
              <Create />
            )}
            { mode === 'reset' && (
              <Reset />
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

