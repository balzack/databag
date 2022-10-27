import { TextInput, Alert, Switch, TouchableOpacity, View, Text, Modal, FlatList, KeyboardAvoidingView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AntIcon from '@expo/vector-icons/AntDesign';
import MatIcon from '@expo/vector-icons/MaterialCommunityIcons';
import { styles } from './Dashboard.styled';
import { useLocation } from 'react-router-dom';
import { useDashboard } from './useDashboard.hook';
import { Logo } from 'utils/Logo';

export function Dashboard(props) {

  const location = useLocation();
  const { config, server, token } = location.state;
  const { state, actions } = useDashboard(config, server, token); 

  const saveConfig = async () => {
    try {
      await actions.saveConfig();
      actions.hideEditConfig();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Save Settings',
        'Please try again.',
      );
    }
  }

  const addUser = async () => {
    try {
      await actions.addUser();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Generate Access Token',
        'Please try again.',
      );
    }
  }

  const accessUser = async (accountId) => {
    try {
      await actions.accessUser(accountId);
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Generate Access Token',
        'Please try again.',
      );
    }
  }

  const removeUser = (accountId) => {
    Alert.alert(
      "Deleting Account",
      "Confirm?",
      [
        { text: "Cancel", onPress: () => {}, },
        { text: "Delete", onPress: async() => {
          try {
            await actions.removeUser(accountId);
          }
          catch (err) {
            console.log(err);
            Alert.alert(
              "Failed to Delete Account",
              "Please try again.",
            );
          }
        }}
      ]
    )
  }

  const enableUser = async (accountId, enabled) => {
    try {
      await actions.enableUser(accountId, enabled);
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Update Account',
        'Please try again.',
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Accounts</Text>
        <TouchableOpacity onPress={actions.refresh}>
          <AntIcon style={styles.icon} name={'reload1'} size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={actions.showEditConfig}>
          <AntIcon style={styles.icon} name={'setting'} size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={actions.logout}>
          <AntIcon style={styles.icon} name={'logout'} size={20} /> 
        </TouchableOpacity>
        <View style={styles.end}>
          <TouchableOpacity onPress={addUser}>
            <AntIcon style={styles.icon} name={'adduser'} size={24} /> 
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
                <TouchableOpacity onPress={() => accessUser(item.accountId)}>
                  <AntIcon style={styles.icon} name={'unlock'} size={20} /> 
                </TouchableOpacity>
                { item.disabled && (
                  <TouchableOpacity onPress={() => enableUser(item.accountId, true)}>
                    <AntIcon style={styles.disable} name={'playcircleo'} size={20} />
                  </TouchableOpacity>
                )}
                { !item.disabled && (
                  <TouchableOpacity onPress={() => enableUser(item.accountId, false)}>
                    <MatIcon style={styles.disable} name={'block-helper'} size={20} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => removeUser(item.accountId)}>
                  <AntIcon style={styles.delete} name={'deleteuser'} size={20} />
                </TouchableOpacity> 
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
              <TextInput style={styles.input} value={state.domain} onChangeText={actions.setDomain}
                  autoCorrect={false} autoCapitalize="none" placeholder="Federated Host" />
              <TextInput style={styles.input} value={state.storage}
                  onChangeText={actions.setStorage}
                  keyboardType='numeric' placeholder="Storage Limit (GB) / Account" />
              <Text style={styles.modalLabel}>Account Key Type:</Text>
              <View style={styles.keyType}>
                <TouchableOpacity style={styles.optionLeft} activeOpacity={1}
                    onPress={() => actions.setKeyType('RSA2048')}>
                  { state.keyType === 'RSA2048' && (
                    <View style={styles.selected} />
                  )}
                  { state.keyType === 'RSA4096' && (
                    <View style={styles.radio} />
                  )}
                  <Text style={styles.option}>RSA 2048</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionRight} activeOpacity={1}
                    onPress={() => actions.setKeyType('RSA4096')}>
                  { state.keyType === 'RSA2048' && (
                    <View style={styles.radio} />
                  )}
                  { state.keyType === 'RSA4096' && (
                    <View style={styles.selected} />
                  )}
                  <Text style={styles.option}>RSA 4096</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.media} activeOpacity={1}
                  onPress={() => actions.setEnableImage(!state.enableImage)}>
                <Text style={styles.modalLabel}>Enable Image Queue: </Text>
                <Switch style={styles.switch} value={state.enableImage}
                  onValueChange={actions.setEnableImage} trackColor={styles.track}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.media} activeOpacity={1}
                  onPress={() => actions.setEnableAudio(!state.enableAudio)}>
                <Text style={styles.modalLabel}>Enable Audio Queue: </Text>
                <Switch style={styles.switch} value={state.enableAudio}
                  onValueChange={actions.setEnableAudio} trackColor={styles.track}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.media} activeOpacity={1}
                  onPress={() => actions.setEnableVideo(!state.enableVideo)}>
                <Text style={styles.modalLabel}>Enable Video Queue: </Text>
                <Switch style={styles.switch} value={state.enableVideo}
                  onValueChange={actions.setEnableVideo} trackColor={styles.track}/>
              </TouchableOpacity>
            </View>
            <View style={styles.modalControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideEditConfig}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={saveConfig}>
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Create Account:</Text>
            </View>
            <View style={styles.accessToken}>
              <Text style={styles.tokenLabel}>Token:</Text>
              <TouchableOpacity style={styles.copy} onPress={() => Clipboard.setString(state.createToken)}>
                <Text style={styles.token}>{ state.createToken }</Text>
                <AntIcon style={styles.icon} name={'copy1'} size={20} /> 
              </TouchableOpacity>
            </View>
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Access Account:</Text>
            </View>
            <View style={styles.accessToken}>
              <Text style={styles.tokenLabel}>Token:</Text>
              <TouchableOpacity style={styles.copy} onPress={() => Clipboard.setString(state.accessToken)}>
                <Text style={styles.token}>{ state.accessToken }</Text>
                <AntIcon style={styles.icon} name={'copy1'} size={20} />  
              </TouchableOpacity>
            </View>
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

