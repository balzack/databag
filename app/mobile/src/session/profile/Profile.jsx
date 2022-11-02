import { useEffect, useContext } from 'react';
import { KeyboardAvoidingView, Modal, Alert, TextInput, ScrollView, View, Switch, TouchableOpacity, Text } from 'react-native';
import { styles } from './Profile.styled';
import { useProfile } from './useProfile.hook';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';
import ImagePicker from 'react-native-image-crop-picker'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileBody } from './profileBody/ProfileBody';

export function Profile({ navigation }) {

  const { state, actions } = useProfile();

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={styles.title}>
            <Text style={styles.titleText}>{ `${state.handle}@${state.node}` }</Text>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity style={styles.action} onPress={logout} onLongPress={actions.showDelete}>
            <Ionicons name="logout" size={22} color={Colors.primary} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, state]);

  const remove = async () => {
    try {
      await actions.remove();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Delete Account',
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

  return (
    <ScrollView style={styles.background}>
      { state.tabbed && (
        <>
          <ProfileBody />
          <TouchableOpacity style={styles.erase} activeOpacity={1} onPress={actions.showDelete}>
            <Text style={styles.eraseText}>Delete Your Account</Text>
          </TouchableOpacity>
        </>
      )}
      { !state.tabbed && (
        <SafeAreaView style={styles.drawer} edges={['top', 'bottom', 'right']}>
          <View style={styles.header}>
            <Text style={styles.headerText} numberOfLines={1}>{ `${state.handle}@${state.node}` }</Text>
            <TouchableOpacity onPress={logout} onLongPress={actions.showDelete}>
              <Ionicons name="logout" size={16} color={Colors.grey} />
            </TouchableOpacity>
          </View>
          <ProfileBody />
          <TouchableOpacity style={styles.erase} activeOpacity={1} onPress={actions.showDelete}>
            <Text style={styles.eraseText}>Delete Your Account</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.showDelete}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideDelete}
      >
        <KeyboardAvoidingView behavior="height" style={styles.editWrapper}>
          <View style={styles.editContainer}>
            <Text style={styles.editHeader}>Deleting Your Account</Text>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.confirmDelete} onChangeText={actions.setConfirmDelete}
                  autoCapitalize="none" placeholder="Type 'delete' to Confirm" placeholderTextColor={Colors.grey} />
            </View>
            <View style={styles.editControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideDelete}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              { state.confirmDelete === 'delete' && (
                <TouchableOpacity style={styles.remove} onPress={remove}>
                  <Text style={styles.removeText}>Delete</Text>
                </TouchableOpacity>
              )}
              { state.confirmDelete !== 'delete' && (
                <TouchableOpacity style={styles.unconfirmed}>
                  <Text style={styles.removeText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  )
}

