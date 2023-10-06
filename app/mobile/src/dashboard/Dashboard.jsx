import { ScrollView, TextInput, Alert, Switch, TouchableOpacity, View, Text, Modal, FlatList, KeyboardAvoidingView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './Dashboard.styled';
import { useLocation } from 'react-router-dom';
import { useDashboard } from './useDashboard.hook';
import { Logo } from 'utils/Logo';
import { InputField } from 'utils/InputField';

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
    actions.promptRemove(accountId);
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
        <Text style={styles.headerLabel}>{ state.strings.accounts }</Text>
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
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContainer}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>{ state.strings.settings }</Text>
            </View>
            <ScrollView style={styles.modalBody}>

              <InputField style={styles.field}
                label={state.strings.federatedHost}
                value={state.domain}
                autoCapitalize={'none'}
                spellCheck={false}
                onChangeText={actions.setDomain}
              />

              <InputField style={styles.field}
                label={state.strings.storageLimit}
                value={state.storage}
                autoCapitalize={'none'}
                spellCheck={false}
                keyboardType={'numeric'}
                onChangeText={actions.setStorage}
              />

              <Text style={styles.modalLabel}>{ state.strings.keyType }</Text>
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
                  onPress={() => actions.setPushSupported(!state.pushSupported)}>
                <Text style={styles.modalLabel}>{ state.strings.enableNotifications }</Text>
                <Switch style={styles.switch} value={state.pushSupported}
                  onValueChange={actions.setPushSupported} trackColor={styles.track}/>
              </TouchableOpacity>

              <View style={styles.label}></View>

              <TouchableOpacity style={styles.media} activeOpacity={1}
                  onPress={() => actions.setEnableImage(!state.enableImage)}>
                <Text style={styles.modalLabel}>{ state.strings.enableImage }</Text>
                <Switch style={styles.switch} value={state.enableImage}
                  onValueChange={actions.setEnableImage} trackColor={styles.track}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.media} activeOpacity={1}
                  onPress={() => actions.setEnableAudio(!state.enableAudio)}>
                <Text style={styles.modalLabel}>{ state.strings.enableAudio }</Text>
                <Switch style={styles.switch} value={state.enableAudio}
                  onValueChange={actions.setEnableAudio} trackColor={styles.track}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.media} activeOpacity={1}
                  onPress={() => actions.setEnableVideo(!state.enableVideo)}>
                <Text style={styles.modalLabel}>{ state.strings.enableVideo }</Text>
                <Switch style={styles.switch} value={state.enableVideo}
                  onValueChange={actions.setEnableVideo} trackColor={styles.track}/>
              </TouchableOpacity>

              <View style={styles.label}></View>
              <TouchableOpacity style={styles.ice} activeOpacity={1}
                  onPress={() => actions.setEnableIce(!state.enableIce)}>
                <Text style={styles.modalLabel}>{ state.strings.enableCalls }</Text>
                <Switch style={styles.switch} value={state.enableIce}
                  onValueChange={actions.setEnableIce} trackColor={styles.track}/>
              </TouchableOpacity>

              <InputField style={styles.field}
                label={state.strings.relayUrl}
                value={state.iceUrl}
                autoCapitalize={'none'}
                spellCheck={false}
                disabled={!state.enableIce}
                onChangeText={actions.setIceUrl}
              />

              <InputField style={styles.field}
                label={state.strings.relayUsername}
                value={state.iceUsername}
                autoCapitalize={'none'}
                spellCheck={false}
                disabled={!state.enableIce}
                onChangeText={actions.setIceUsername}
              />

              <InputField style={styles.field}
                label={state.strings.relayPassword}
                value={state.icePassword}
                autoCapitalize={'none'}
                spellCheck={false}
                disabled={!state.enableIce}
                onChangeText={actions.setIcePassword}
              />

              <View style={styles.pad} />

            </ScrollView>
            <View style={styles.modalControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideEditConfig}>
                <Text style={styles.cancelText}>{ state.strings.cancel }</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={saveConfig}>
                <Text style={styles.saveText}>{ state.strings.save }</Text>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>{ state.strings.createAccount }</Text>
            </View>
            <View style={styles.accessToken}>
              <Text style={styles.tokenLabel}>{ state.strings.token }</Text>
              <TouchableOpacity style={styles.copy} onPress={() => Clipboard.setString(state.createToken)}>
                <Text style={styles.token}>{ state.createToken }</Text>
                <AntIcon style={styles.icon} name={'copy1'} size={20} /> 
              </TouchableOpacity>
            </View>
            <View style={styles.modalControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideAddUser}>
                <Text style={styles.cancelText}>{ state.strings.close }</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.accessUser}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideAccessUser}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>{ state.strings.accessAccount }</Text>
            </View>
            <View style={styles.accessToken}>
              <Text style={styles.tokenLabel}>{ state.strings.token }</Text>
              <TouchableOpacity style={styles.copy} onPress={() => Clipboard.setString(state.accessToken)}>
                <Text style={styles.token}>{ state.accessToken }</Text>
                <AntIcon style={styles.icon} name={'copy1'} size={20} />  
              </TouchableOpacity>
            </View>
            <View style={styles.modalControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideAccessUser}>
                <Text style={styles.cancelText}>{ state.strings.close }</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  )
}

