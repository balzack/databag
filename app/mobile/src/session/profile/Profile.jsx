import { ActivityIndicator, KeyboardAvoidingView, Image, Modal, View, Switch, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/AntDesign';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'constants/Colors';
import { useProfile } from './useProfile.hook';
import { styles } from './Profile.styled';
import avatar from 'images/avatar.png';

export function Profile() {

  const { state, actions } = useProfile();

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
      actions.hideEditDetails();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Save Details',
        'Please try again.'
      )
    }
  }

  console.log(state.imageSource);
  

  return (
    <ScrollView style={styles.content}>

      <Image source={state.imageSource} style={{ width: state.width, height: state.height }} resizeMode={'contain'} />

      <View style={styles.details}>
        <View style={styles.control}>
          <TouchableOpacity style={styles.edit}>
            <Text style={styles.editLabel}>Edit</Text>
            <MatIcons name="square-edit-outline" size={14} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

