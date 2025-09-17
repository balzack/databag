import { ActivityIndicator, KeyboardAvoidingView, Image, Modal, View, Switch, Text, Platform, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import AntIcons from 'react-native-vector-icons/AntDesign';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker'
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Colors } from 'constants/Colors';
import { InputField } from 'utils/InputField';
import { useProfile } from './useProfile.hook';
import { styles } from './Profile.styled';
import avatar from 'images/avatar.png';

export function Profile({ drawer }) {

  const [busyDetail, setBusyDetail] = useState(false);
  const { state, actions } = useProfile();
  const OVERLAP = 56;

  const onGallery = async () => {
    try {
      const full = await ImagePicker.openPicker({ mediaType: 'photo', width: 256, height: 256 });
      const crop = await ImagePicker.openCropper({ path: full.path, width: 256, height: 256, cropperCircleOverlay: true, includeBase64: true });
      try {
        await actions.setProfileImage(crop.data);
      }
      catch (err) {
        console.log(err);
        Alert.alert(
          state.strings.error,
          state.strings.tryAgain,
        );
      }
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
    if (!busyDetail) {
      setBusyDetail(true);
      try {
        await actions.saveDetails();
        actions.hideDetails();
      }
      catch (err) {
        console.log(err);
        Alert.alert(
          state.strings.error,
          state.strings.tryAgain,
        )
      }
      setBusyDetail(false);
    }
  }

  return (
    <>
      { drawer && (
        <View style={styles.drawerContainer}>
          <Text style={styles.drawerHeader} adjustsFontSizeToFit={true} numberOfLines={1}>{ state.username }</Text>
          <View style={styles.drawerFrame}>
            <Image source={state.imageSource} style={styles.drawerLogo} resizeMode={'contain'} />
            <TouchableOpacity activeOpacity={1} style={styles.drawerLogoEdit} onPress={onGallery}>
              <Text style={styles.editLabel}>{ state.strings.edit }</Text>
              <MatIcons name="square-edit-outline" size={14} color={Colors.linkText} />
            </TouchableOpacity>
          </View>
          <View style={styles.drawerEditDivider}>
            <View style={styles.drawerLine} />
            <TouchableOpacity style={styles.drawerNameEdit} activeOpacity={1} onPress={actions.showDetails}>
              <Text style={styles.editLabel}>{ state.strings.edit }</Text>
              <MatIcons name="square-edit-outline" size={14} color={Colors.linkText} />
            </TouchableOpacity>
          </View>
          <View style={styles.drawerName}>
            { state.name && (
              <Text style={styles.drawerNameSet} numberOfLines={1} adjustsFontSizeToFit={true}>{ state.name }</Text>
            )}
            { !state.name && (
              <Text style={styles.drawerNameUnset}>{ state.strings.name }</Text>
            )}
          </View>
          <View style={styles.drawerEntry}>
            <AntIcons name="enviromento" style={styles.drawerIcon} size={20} color={Colors.text} />
            { state.location && (
              <Text style={styles.locationSet}>{ state.location }</Text>
            )}
            { !state.location && (
              <Text style={styles.locationUnset}>{ state.strings.location }</Text>
            )}
          </View>
          <View style={styles.drawerEntry}>
            <MatIcons name="book-open-outline" style={styles.drawerDescriptionIcon} size={20} color={Colors.text} />
            { state.description && (
              <Text style={styles.descriptionSet}>{ state.description }</Text>
            )}
            { !state.description && (
              <Text style={styles.descriptionUnset}>{ state.strings.description }</Text>
            )}
          </View>
          <TouchableOpacity style={styles.drawerEntry} activeOpacity={1}>
            <MatIcons name="eye-outline" style={styles.drawerIcon} size={20} color={Colors.text} />
            <TouchableOpacity activeOpacity={1} onPress={() => setVisible(!state.searchable)}>
              <Text style={styles.visibleLabel}>{ state.strings.visibleRegistry }</Text>
            </TouchableOpacity>
            <Switch value={state.searchable} style={Platform.OS==='ios' ? styles.visibleSwitch : {}} thumbColor={Colors.sliderGrip}
                ios_backgroundColor={Colors.idleFill} trackColor={styles.track} onValueChange={setVisible} />
          </TouchableOpacity>
        </View>
      )}
      { !drawer && (
        <View style={styles.container}>
          <Image source={state.imageSource} style={{ ...styles.logo, width: state.imageWidth, height: state.imageHeight }} resizeMode={'contain'} />
          <View style={styles.content}>
            <View style={{ width: state.imageWidth, height: state.imageHeight - OVERLAP }} />
            <View style={styles.control}>
              <Menu>
                <MenuTrigger customStyles={styles.trigger}>
                  <View style={styles.edit}>
                    <Text style={styles.editLabel}>{ state.strings.edit }</Text>
                    <MatIcons name="square-edit-outline" size={14} color={Colors.linkText} />
                  </View>
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={{ width: 'auto' }} style={styles.options}>
                  <MenuOption onSelect={onGallery}>
                    <Text style={styles.option}>{ state.strings.editImage }</Text>
                  </MenuOption>
                  <MenuOption onSelect={actions.showDetails}>
                    <Text style={styles.option}>{ state.strings.editDetails }</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
            <View style={{ ...styles.details, width: state.detailWidth }}>
              { state.name && (
                <Text style={styles.nameSet} numberOfLines={1} adjustsFontSizeToFit={true}>{ state.name }</Text>
              )}
              { !state.name && (
                <Text style={styles.nameUnset}>{ state.strings.name }</Text>
              )}
              <Text style={styles.username} numberOfLines={1}>{ state.username }</Text>
              <View style={styles.attributes}>
                <View style={styles.entry}>
                  <AntIcons name="enviromento" style={styles.icon} size={20} color={Colors.text} />
                  { state.location && (
                    <Text style={styles.locationSet}>{ state.location }</Text>
                  )}
                  { !state.location && (
                    <Text style={styles.locationUnset}>{ state.strings.location }</Text>
                  )}
                </View>
                <View style={styles.divider} />
                <ScrollView style={styles.description}>
                  <View style={styles.entry}>
                  <MatIcons name="book-open-outline" style={styles.descriptionIcon} size={20} color={Colors.text} />
                  { state.description && (
                    <Text style={styles.descriptionSet}>{ state.description }</Text>
                  )}
                  { !state.description && (
                    <Text style={styles.descriptionUnset}>{ state.strings.description }</Text>
                  )}
                  </View>
                </ScrollView>
              </View>
              <View style={styles.group}>
                <TouchableOpacity style={styles.entry} activeOpacity={1}>
                  <MatIcons name="eye-outline" style={styles.icon} size={20} color={Colors.text} />
                  <TouchableOpacity activeOpacity={1} onPress={() => setVisible(!state.searchable)}>
                    <Text style={styles.visibleLabel}>{ state.strings.visibleRegistry }</Text>
                  </TouchableOpacity>
                  <Switch value={state.searchable} style={Platform.OS==='ios' ? styles.visibleSwitch : {}} thumbColor={Colors.sliderGrip} ios_backgroundColor={Colors.disabledIndicator}
                      trackColor={styles.track} onValueChange={setVisible} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.details}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideDetails}
      >
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContainer}>
            <View style={styles.modalClose}>
              <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideDetails}>
                <MatIcons name="close" size={20} color={Colors.descriptionText} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalHeader}>{ state.strings.editDetails }</Text>

            <InputField
              label={state.strings.name}
              value={state.detailName}
              autoCapitalize={'none'}
              spellCheck={false}
              multiline={false}
              style={styles.field}
              onChangeText={actions.setDetailName}
            />

            <InputField
              label={state.strings.location}
              value={state.detailLocation}
              autoCapitalize={'none'}
              spellCheck={false}
              multiline={false}
              style={styles.field}
              onChangeText={actions.setDetailLocation}
            />

            <InputField
              label={state.strings.description}
              value={state.detailDescription}
              autoCapitalize={'none'}
              spellCheck={false}
              multiline={true}
              style={styles.field}
              onChangeText={actions.setDetailDescription}
            />

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.cancelButton} activeOpacity={1} onPress={actions.hideDetails}>
                <Text style={styles.cancelButtonText}>{ state.strings.cancel }</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} activeOpacity={1} onPress={saveDetails}>
                { busyDetail && (
                  <ActivityIndicator animating={true} color={Colors.primaryButtonText} />
                )}
                { !busyDetail && (
                  <Text style={styles.saveButtonText}>{ state.strings.save }</Text>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAvoidingView>
      </Modal>

    </>
  );
}

