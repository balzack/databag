import { ActivityIndicator, KeyboardAvoidingView, Image, Modal, View, Switch, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import AntIcons from 'react-native-vector-icons/AntDesign';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
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
        state.strings.error,
        state.strings.tryAgain,
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
        state.strings.error,
        state.strings.tryAgain,
      )
    }
  }

const triggerStyles = {
  triggerTouchable: {
    activeOpacity: 70,
  },
};


  return (
    <ScrollView style={styles.content}>

      <Image source={state.imageSource} style={{ width: state.width, height: state.height, alignSelf: 'center' }} resizeMode={'contain'} />

      <View style={styles.details}>
        <View style={styles.control}>

    <Menu>
      <MenuTrigger customStyles={styles.trigger}>
          <View style={styles.edit}>
            <Text style={styles.editLabel}>{ state.strings.edit }</Text>
            <MatIcons name="square-edit-outline" size={14} color={Colors.linkText} />
          </View>
      </MenuTrigger>
      <MenuOptions style={styles.options}>
        <MenuOption onSelect={() => alert(`image`)}>
          <Text style={styles.option}>{ state.strings.editImage }</Text>
        </MenuOption>
        <MenuOption onSelect={() => alert(`details`)}>
          <Text style={styles.option}>{ state.strings.editDetails }</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>

        </View>

        { state.name && (
          <Text style={styles.nameSet} numberOfLines={1} adjustsFontSizeToFit={true}>{ state.name }</Text>
        )}
        { !state.name && (
          <Text style={styles.nameUnset}>{ state.strings.name }</Text>
        )}

        <Text style={styles.username} numberOfLines={1}>{ state.username }</Text>

        <View style={styles.group}>
          <View style={styles.entry}>
            <AntIcons name="enviromento" style={styles.icon} size={20} color={Colors.text} />
            { state.location && (
              <Text style={styles.locationSet}>{ state.location }</Text>
            )}
            { !state.location && (
              <Text style={styles.locationUnset}>Location</Text>
            )}
          </View>
          <View style={styles.divider} />
          <View style={styles.entry}>
            <MatIcons name="book-open-outline" style={styles.icon} size={20} color={Colors.text} />
            { state.location && (
              <Text style={styles.descriptionSet}>{ state.description }</Text>
            )}
            { !state.description && (
              <Text style={styles.descriptionUnset}>Description</Text>
            )}
          </View>
        </View>

        <View style={styles.group}>
          <TouchableOpacity style={styles.entry} activeOpacity={1}>
            <MatIcons name="eye-outline" style={styles.icon} size={20} color={Colors.text} />
            <Text style={styles.visibleLabel}>{ state.strings.visibleRegistry }</Text>
            <Switch value={state.searchable} style={styles.visibleSwitch} thumbColor={Colors.sliderGrip} ios_backgroundColor={Colors.disabledIndicator}
                trackColor={styles.track} onValueChange={setVisible} />
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

