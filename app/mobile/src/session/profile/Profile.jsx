import { useContext } from 'react';
import { Alert, ScrollView, View, Switch, TouchableOpacity, Text } from 'react-native';
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
      <TouchableOpacity style={styles.header}>
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
      <TouchableOpacity style={styles.detail}>
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
    </ScrollView>
  )
}

