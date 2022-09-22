import { useContext } from 'react';
import { Modal, Alert, TextInput, ScrollView, View, Switch, TouchableOpacity, Text } from 'react-native';
import { styles } from './Profile.styled';
import { useProfile } from './useProfile.hook';
import { Logo } from 'utils/Logo';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';
import ImagePicker from 'react-native-image-crop-picker'

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

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity style={styles.header} onPress={actions.showLoginEdit}>
          <Text style={styles.headerText}>{ `${state.handle}@${state.node}` }</Text>
        </TouchableOpacity>
        <View style={{ width: 128 }}>
          <Logo src={state.imageSource} width={128} height={128} radius={8} />
          <TouchableOpacity style={styles.camera} onPress={onCamera}>
            <Ionicons name="camerao" size={14} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.gallery} onPress={onGallery}>
            <Ionicons name="picture" size={14} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.detail} onPress={actions.showDetailEdit}>
          <View style={styles.attribute}>
            <Text style={styles.nametext}>{ state.name }</Text>
            <Ionicons name="edit" size={16} color={Colors.text} />
          </View>
          <View style={styles.attribute}>
            <Ionicons name="enviromento" size={14} color={Colors.text} />
            <Text style={styles.locationtext}>{ state.location }</Text>
          </View> 
          <View style={styles.attribute}>
            <Ionicons name="book" size={14} color={Colors.text} />
            <Text style={styles.descriptiontext}>{ state.description }</Text>
          </View> 
        </TouchableOpacity>
        <View style={styles.visible}>
          <Text style={styles.visibleText}>Visible in Registry</Text>
          <Switch style={styles.visibleSwitch} value={state.searchable} onValueChange={setVisible} trackColor={styles.switch}/>
        </View>
        <TouchableOpacity style={styles.logout} onPress={actions.logout}>
          <Ionicons name="logout" size={14} color={Colors.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.showDetailEdit}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideDetailEdit}
      >
        <View style={styles.editWrapper}>
          <View style={styles.editContainer}>
            <Text style={styles.editHeader}>Edit Details:</Text>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.editName} onChangeText={actions.setEditName}
                  autoCapitalize="word" placeholder="Name" />
            </View>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.editLocation} onChangeText={actions.setEditLocation}
                  autoCapitalize="sentence" placeholder="Location" />
            </View>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.editDescription} onChangeText={actions.setEditDescription}
                  autoCapitalize="none" placeholder="Description" multiline={true} />
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
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.showLoginEdit}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideLoginEdit}
      >
        <View style={styles.editWrapper}>
          <View style={styles.editContainer}>
            <Text style={styles.editHeader}>Change Login:</Text>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.editHandle} onChangeText={actions.setEditHandle}
                  placeholder="Username" />
            </View>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.editPassword} onChangeText={actions.setEditPassword}
                  secureTextEntry={true} placeholder="Password" />
            </View>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.editConfirm} onChangeText={actions.setEditConfirm}
                  secureTextEntry={true} placeholder="Confirm Password" />
            </View>
            <View style={styles.editControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideLoginEdit}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={saveLogin}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

