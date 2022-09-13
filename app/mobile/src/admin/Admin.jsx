import { SafeAreaView, Image, View } from 'react-native';
import { styles } from './Admin.styled';
import { useAdmin } from './useAdmin.hook';
import { Prompt } from './prompt/Prompt';
import { Dashboard } from './dashboard/Dashboard';
import logo from 'images/login.png'; 

export function Admin() {

  const { state, actions } = useAdmin();

  return (
    <View style={styles.wrapper}>
      <SafeAreaView>
        { state.split === true && (
          <View style={styles.container}>
            <View style={styles.paddedPane}>
              <Image style={styles.splash} source={logo} />
            </View>
            <View style={styles.pane}>
              { state.token == null && (
                <Prompt login={actions.login} />
              )}
              { state.token != null && (
                <Dashboard token={state.token} config={state.config} logout={actions.logout} />
              )}
            </View>
          </View>
        )}
        { state.split === false && (
          <View style={styles.container}>
            { state.token == null && (
              <Prompt login={actions.login} />
            )}
            { state.token != null && (
              <Dashboard token={state.token} config={state.config} logout={actions.logout} />
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

