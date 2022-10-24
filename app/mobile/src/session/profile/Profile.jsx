import { useContext } from 'react';
import { KeyboardAvoidingView, Modal, Alert, TextInput, ScrollView, View, Switch, TouchableOpacity, Text } from 'react-native';
import { styles } from './Profile.styled';
import { useProfile } from './useProfile.hook';
import { Logo } from 'utils/Logo';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';
import ImagePicker from 'react-native-image-crop-picker'
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlockedTopics } from './blockedTopics/BlockedTopics';
import { BlockedContacts } from './blockedContacts/BlockedContacts';
import { BlockedMessages } from './blockedMessages/BlockedMessages';

export function ProfileTitle(props) {
  const { state, actions } = useProfile();
  return (
    <View style={styles.title}>
      <Text style={styles.titleText}>{ `${state.handle}@${state.node}` }</Text>
    </View>
  )
} 

export function Profile() {

  const { state, actions } = useProfile();

  const setVisible = async (visible) => {
    try {
      await actions.setVisible(visible);
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Account Update Failed',
        'Please try again.'
      );
    }
  }

  const saveDetails = async () => {
    try {
      await actions.saveDetails();
      actions.hideDetailEdit();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Save Details',
        'Please try again.'
      )
    }
  }

  const saveLogin = async () => {
    try {
      await actions.saveLogin();
      actions.hideLoginEdit();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Change Login',
        'Please try again.'
      )
    }
  }

  const logout = async () => {
    Alert.alert(
      "Logging Out",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Logout", onPress: () => {
          actions.logout();
        }}
      ]
    );
  }

  const onGallery = async () => {
    try {
      const full = await ImagePicker.openPicker({ mediaType: 'photo', width: 256, height: 256 });
      const crop = await ImagePicker.openCropper({ path: full.path, width: 256, height: 256, cropperCircleOverlay: true, includeBase64: true });
      await actions.setProfileImage(crop.data);
    }
    catch (err) {
      console.log(err);
    }
  }

  const onCamera = async () => {
    try {
      const full = await ImagePicker.openCamera({ mediaType: 'photo', width: 256, height: 256 });
      const crop = await ImagePicker.openCropper({ path: full.path, width: 256, height: 256, cropperCircleOverlay: true, includeBase64: true });
      await actions.setProfileImage(crop.data);
    }
    catch (err) {
      console.log(err);
    }
  }

  const enabled = (state.checked && state.available && state.editConfirm === state.editPassword && state.editPassword);

  const Body = () => {
    return (
      <View style={styles.container}>
        <View style={{ width: 128 }}>
          <Logo src={state.imageSource} width={128} height={128} radius={8} />
          <TouchableOpacity style={styles.gallery} onPress={onGallery}>
            <Ionicons name="picture" size={14} color={Colors.white} />
          </TouchableOpacity>
        </View>
        { state.disconnected > 3 && (
          <View style={styles.alert}>
            <Text style={styles.disconnected}>Disconnected</Text>
          </View>
        )}
        { !state.disconnected && (
          <View style={styles.alert} />
        )}
        <TouchableOpacity style={styles.detail} onPress={actions.showDetailEdit}>
          <View style={styles.attribute}>
            { state.name && (
              <Text style={styles.nametext}>{ state.name }</Text>
            )}
            { !state.name && (
              <Text style={styles.nonametext}>Name</Text>
            )}
            <Ionicons name="edit" size={16} color={Colors.text} />
          </View>
          <View style={styles.attribute}>
            <Ionicons name="enviromento" size={14} color={Colors.text} />
            { state.location && (
              <Text style={styles.locationtext}>{ state.location }</Text>
            )}
            { !state.location && (
              <Text style={styles.nolocationtext}>Location</Text>
            )}
          </View> 
          <View style={styles.attribute}>
            <Ionicons name="book" size={14} color={Colors.text} />
            { state.description && (
              <Text style={styles.descriptiontext}>{ state.description }</Text>
            )}
            { !state.description && (
              <Text style={styles.nodescriptiontext}>Description</Text>
            )}
          </View> 
        </TouchableOpacity>
        <View style={styles.visible}>
          <TouchableOpacity onPress={() => setVisible(!state.searchable)} activeOpacity={1}>
            <Text style={styles.visibleText}>Visible in Registry</Text>
          </TouchableOpacity>
          <Switch style={styles.visibleSwitch} value={state.searchable} onValueChange={setVisible} trackColor={styles.switch}/>
        </View>
        <TouchableOpacity style={styles.link} onPress={actions.showLoginEdit}>
          <Text style={styles.linkText}>Change Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={actions.showBlockedCards}>
          <Text style={styles.linkText}>Manage Blocked Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={actions.showBlockedChannels}>
          <Text style={styles.linkText}>Manage Blocked Topics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={actions.showBlockedMessages}>
          <Text style={styles.linkText}>Manage Blocked Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Ionicons name="logout" size={14} color={Colors.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  };
 
  return (
    <ScrollView>
      { state.tabbed && (
        <View style={styles.body}>
          <Body />
        </View>
      )}
      { !state.tabbed && (
        <SafeAreaView style={styles.drawer} edges={['top', 'bottom', 'right']}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{ `${state.handle}@${state.node}` }</Text>
          </View>
          <Body />
        </SafeAreaView>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.blockedCards}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideBlockedCards}
      >
        <KeyboardAvoidingView behavior="height" style={styles.editWrapper}>
          <View style={styles.editContainer}>
            <Text style={styles.editHeader}>Blocked Contacts:</Text>
            <View style={styles.editList}>
              <BlockedContacts />
            </View>
            <View style={styles.editControls}>
              <TouchableOpacity style={styles.close} onPress={actions.hideBlockedCards}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.blockedChannels}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideBlockedChannels}
      >
        <KeyboardAvoidingView behavior="height" style={styles.editWrapper}>
          <View style={styles.editContainer}>
            <Text style={styles.editHeader}>Blocked Topics:</Text>
            <View style={styles.editList}>
              <BlockedTopics />
            </View>
            <View style={styles.editControls}>
              <TouchableOpacity style={styles.close} onPress={actions.hideBlockedChannels}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.blockedMessages}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideBlockedMessages}
      >
        <KeyboardAvoidingView behavior="height" style={styles.editWrapper}>
          <View style={styles.editContainer}>
            <Text style={styles.editHeader}>Blocked Messages:</Text>
            <View style={styles.editList}>
              <BlockedMessages />
            </View>
            <View style={styles.editControls}>
              <TouchableOpacity style={styles.close} onPress={actions.hideBlockedMessages}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.showDetailEdit}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideDetailEdit}
      >
        <KeyboardAvoidingView behavior="height" style={styles.editWrapper}>
          <View style={styles.editContainer}>
            <Text style={styles.editHeader}>Edit Details:</Text>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.editName} onChangeText={actions.setEditName}
                  autoCapitalize="words" placeholder="Name" placeholderTextColor={Colors.grey} />
            </View>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.editLocation} onChangeText={actions.setEditLocation}
                  autoCapitalize="words" placeholder="Location" placeholderTextColor={Colors.grey} />
            </View>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.editDescription} onChangeText={actions.setEditDescription}
                  autoCapitalize="sentences" placeholder="Description" multiline={true} 
                  placeholderTextColor={Colors.grey} />
            </View>
            <View style={styles.editControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideDetailEdit}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={saveDetails}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.showLoginEdit}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideLoginEdit}
      >
        <KeyboardAvoidingView behavior="height" style={styles.editWrapper}>
          <View style={styles.editContainer}>
            <Text style={styles.editHeader}>Change Login:</Text>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.editHandle} onChangeText={actions.setEditHandle}
                  autoCapitalize={'none'} placeholder="Username" placeholderTextColor={Colors.grey} />
              { state.checked && state.available && (
                <Ionicons style={styles.icon} name="checkcircleo" size={18} color={Colors.background} />
              )}
              { state.checked && !state.available && (
                <Ionicons style={styles.icon} name="exclamationcircleo" size={18} color={Colors.alert} />
              )}
            </View>
            { !state.showPassword && (
              <View style={styles.inputField}>
                <TextInput style={styles.input} value={state.editPassword} onChangeText={actions.setEditPassword}
                    autoCapitalize={'none'} secureTextEntry={true} placeholder="Password"
                    placeholderTextColor={Colors.grey} />
                <TouchableOpacity onPress={actions.showPassword}>
                  <Ionicons style={styles.icon} name="eyeo" size={18} color="#888888" />
                </TouchableOpacity>
              </View>
            )}
            { state.showPassword && (
              <View style={styles.inputField}>
                <TextInput style={styles.input} value={state.editPassword} onChangeText={actions.setEditPassword}
                    autoCapitalize={'none'} secureTextEntry={false} placeholder="Password"
                    placeholderTextColor={Colors.grey} />
                <TouchableOpacity onPress={actions.hidePassword}>
                  <Ionicons style={styles.icon} name="eye" size={18} color="#888888" />
                </TouchableOpacity>
              </View>
            )}
            { !state.showConfirm && (
              <View style={styles.inputField}>
                <TextInput style={styles.input} value={state.editConfirm} onChangeText={actions.setEditConfirm}
                    autoCapitalize={'none'} secureTextEntry={true} placeholder="Confirm"
                    placeholderTextColor={Colors.grey} />
                <TouchableOpacity onPress={actions.showConfirm}>
                  <Ionicons style={styles.icon} name="eyeo" size={18} color="#888888" />
                </TouchableOpacity>
              </View>
            )}
            { state.showConfirm && (
              <View style={styles.inputField}>
                <TextInput style={styles.input} value={state.editConfirm} onChangeText={actions.setEditConfirm}
                    autoCapitalize={'none'} secureTextEntry={false} placeholder="Confirm"
                    placeholderTextColor={Colors.grey} />
                <TouchableOpacity onPress={actions.hideConfirm}>
                  <Ionicons style={styles.icon} name="eye" size={18} color="#888888" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.editControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideLoginEdit}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              { enabled && (
                <TouchableOpacity style={styles.save} onPress={saveLogin}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              )}
              { !enabled && (
                <View style={styles.disabled}>
                  <Text style={styles.disabledText}>Save</Text>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  )
}

