import { TextInput, TouchableOpacity, View, Text, Modal, FlatList, KeyboardAvoidingView } from 'react-native';
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
        <TouchableOpacity onPress={actions.refresh}>
          <Ionicons style={styles.icon} name={'reload1'} size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={actions.showEditConfig}>
          <Ionicons style={styles.icon} name={'setting'} size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={actions.logout}>
          <Ionicons style={styles.icon} name={'logout'} size={20} /> 
        </TouchableOpacity>
        <View style={styles.end}>
          <TouchableOpacity onPress={actions.showAddUser}>
            <Ionicons style={styles.icon} name={'adduser'} size={24} /> 
          </TouchableOpacity>
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
                <TouchableOpacity activeOpacity={1} onPress={() => actions.showAccessUser(item.accountId)}>
                  <Ionicons style={styles.icon} name={'unlock'} size={20} /> 
                </TouchableOpacity>
                <Ionicons style={styles.disable} name={'closecircleo'} size={20} /> 
                <Ionicons style={styles.delete} name={'deleteuser'} size={20} /> 
              </View>
            </View>
          )}
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.editConfig}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideEditConfig}
      >
        <KeyboardAvoidingView behavior="height" style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Settings:</Text>
            </View>
            <View style={styles.modalBody}>
              <TextInput style={styles.input} value={state.hostname} onChangeText={actions.setHostname}
                  autoCorrect={false} autoCapitalize="none" placeholder="Federated Host" />
              <TextInput style={styles.input} value={state.storage} onChangeText={actions.setStorage}
                  keyboardType='numeric' placeholder="Storage Limit (GB) / Account" />
            </View>
            <View style={styles.modalControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideEditConfig}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={actions.hideEditConfig}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.addUser}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideAddUser}
      >
        <KeyboardAvoidingView behavior="height" style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Add User:</Text>
            <View style={styles.modalControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideAddUser}>
                <Text>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.accessUser}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideAccessUser}
      >
        <KeyboardAvoidingView behavior="height" style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Access User:</Text>
            <View style={styles.modalControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideAccessUser}>
                <Text>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  )
}

