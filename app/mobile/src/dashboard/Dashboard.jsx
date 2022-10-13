import { TouchableOpacity, View, Text, Modal, FlatList } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/AntDesign';
import { styles } from './Dashboard.styled';
import { useLocation } from 'react-router-dom';
import { useDashboard } from './useDashboard.hook';
import { Logo } from 'utils/Logo';

export function Dashboard(props) {

  const location = useLocation();
  const { config, server, token } = location.state;
  const { state, actions } = useDashboard(config, server, token); 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Accounts</Text>
        <Ionicons style={styles.icon} name={'reload1'} size={20} />        
        <Ionicons style={styles.icon} name={'setting'} size={20} />
        <TouchableOpacity onPress={actions.logout}>
          <Ionicons style={styles.icon} name={'logout'} size={20} /> 
        </TouchableOpacity>
        <View style={styles.end}>       
          <Ionicons style={styles.icon} name={'adduser'} size={24} /> 
        </View>       
      </View>
      <View style={styles.accounts}>
        <FlatList style={styles.lit} 
          data={state.accounts}
          keyExtractor={item => item.accountId}
          renderItem={({ item }) => (
            <View style={styles.account}>
              <Logo src={item.logo} width={32} height={32} radius={4} />
              <View style={styles.details}>
                <Text style={styles.name}>{ item.name }</Text>
                <Text style={styles.handle}>{ item.handle }</Text>
              </View>
              <View style={styles.control}>
                <Ionicons style={styles.icon} name={'unlock'} size={20} /> 
                <Ionicons style={styles.disable} name={'closecircleo'} size={20} /> 
                <Ionicons style={styles.delete} name={'deleteuser'} size={20} /> 
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

