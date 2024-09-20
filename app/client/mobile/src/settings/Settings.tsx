import React, {useState, useContext} from 'react';
import {Modal, Surface, Button, Text, Divider, Icon} from 'react-native-paper';
import {SafeAreaView, TouchableOpacity, View, Image, ScrollView} from 'react-native';
import {styles} from './Settings.styled';
import {useSettings} from './useSettings.hook';
import ImagePicker from 'react-native-image-crop-picker';
import {BlurView} from '@react-native-community/blur';

export function Settings() {
  const { state, actions } = useSettings();
  const [alert, setAlert] = useState(false);

  const SelectImage = async () => {
    try {
      const full = await ImagePicker.openPicker({ mediaType: 'photo', width: 256, height: 256 });
      const crop = await ImagePicker.openCropper({ path: full.path, width: 256, height: 256, cropperCircleOverlay: true, includeBase64: true });
      try {
        await actions.setProfileImage(crop.data);
      }
      catch (err) {
        console.log(err);
        setAlert(true);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <ScrollView bounces={false}>
        <SafeAreaView style={styles.settings}>
          <Text style={styles.header} adjustsFontSizeToFit={true} numberOfLines={1}>{`${state.profile.handle}${state.profile.node ? '/' + state.profile.node : ''}`}</Text>
          <TouchableOpacity style={styles.image} onPress={SelectImage}>
            <Image style={styles.logo} resizeMode={'contain'} source={{ uri: state.imageUrl }} />
            <View style={styles.editBar}>
              <View style={styles.editBorder}>
                <Surface elevation={0}>
                  <Text style={styles.editLogo}>{state.strings.edit}</Text>
                </Surface>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.editDivider}>
            <Divider style={styles.divider} bold={true} />
            <Button labelStyle={styles.editDetails} mode="text">{state.strings.edit}</Button>
          </View>

          <View style={styles.attributes}>
            {!state.profile.name && (
              <Text style={styles.nameUnset}>{state.strings.name}</Text>
            )}
            {state.profile.name && (
              <Text style={styles.nameSet}>{state.profile.name}</Text>
            )}
            <View style={styles.attribute}>
              <View style={styles.icon}>
                <Icon size={24} source="map-marker-outline" />
              </View>
              {!state.profile.location && (
                <Text style={styles.labelUnset}>{state.strings.location}</Text>
              )}
              {state.profile.location && (
                <Text style={styles.labelSet}>{state.profile.location}</Text>
              )}
            </View>
            <View style={styles.attribute}>
              <View style={styles.icon}>
                <Icon size={24} source="book-open-outline" />
              </View>
              {!state.profile.description && (
                <Text style={styles.labelUnset}>{state.strings.description}</Text>
              )}
              {state.profile.description && (
                <Text style={styles.labelSet}>{state.profile.description}</Text>
              )}
            </View>
          </View>

          <View style={styles.editDivider}>
            <Divider style={styles.divider} bold={true} />
          </View>

          <Button mode="contained" onPress={actions.logout}>
            Logout
          </Button>
        </SafeAreaView>
      </ScrollView>
      {alert && (
        <BlurView
          style={styles.blur}
          blurType="dark"
          blurAmount={2}
          reducedTransparencyFallbackColor="dark"
        />
      )}
      <Modal
        visible={alert}
        onDismiss={() => setAlert(false)}
        contentContainerStyle={styles.modal}>
        <Surface elevation={5} mode="flat" style={styles.content}>
          <Text variant="titleLarge">{state.strings.error}</Text>
          <Text variant="titleSmall">{state.strings.tryAgain}</Text>
          <Button
            mode="text"
            style={styles.close}
            onPress={() => setAlert(false)}>
            {state.strings.close}
          </Button>
        </Surface>
      </Modal>
    </>
  );
}
