import React, {useState, useContext} from 'react';
import {Surface, Button, Text, IconButton, Divider, Icon, TextInput} from 'react-native-paper';
import {SafeAreaView, TouchableOpacity, Modal, View, Image, ScrollView} from 'react-native';
import {styles} from './Settings.styled';
import {useSettings} from './useSettings.hook';
import ImagePicker from 'react-native-image-crop-picker';
import {BlurView} from '@react-native-community/blur';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export function Settings() {
  const { state, actions } = useSettings();
  const [alert, setAlert] = useState(false);
  const [details, setDetails] = useState(false);

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
                <Surface style={styles.editBorder} elevation={0}>
                  <Text style={styles.editLogo}>{state.strings.edit}</Text>
                </Surface>
            </View>
          </TouchableOpacity>

          <View style={styles.divider}>
            <Divider style={styles.line} bold={true} />
            <TouchableOpacity style={styles.editDetails} onPress={() => setDetails(true)}>
              <Text style={styles.editDetailsLabel}>{state.strings.edit}</Text>
            </TouchableOpacity>
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

          <View style={styles.divider}>
            <Divider style={styles.line} bold={true} />
          </View>

          <Button mode="contained" onPress={actions.logout}>
            Logout
          </Button>
        </SafeAreaView>
      </ScrollView>
      <Modal
        visible={alert}
        onDismiss={() => setAlert(false)}
        contentContainerStyle={styles.modal}>
        <View style={styles.modal}>
          <BlurView
            style={styles.blur}
            blurType="dark"
            blurAmount={2}
            reducedTransparencyFallbackColor="dark"
          />
          <Surface elevation={1} mode="flat" style={styles.content}>
            <Text variant="titleLarge">{state.strings.error}</Text>
            <Text variant="titleSmall">{state.strings.tryAgain}</Text>
            <Button
              mode="text"
              style={styles.close}
              onPress={() => setAlert(false)}>
              {state.strings.close}
            </Button>
          </Surface>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
        visible={details}
        onRequestClose={() => setDetails(false)}>
        <View style={styles.modal}>
          <BlurView
            style={styles.blur}
            blurType="dark"
            blurAmount={2}
            reducedTransparencyFallbackColor="dark"
          />
          <KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Surface elevation={1} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{ state.strings.editDetails }</Text>
              <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setDetails(false)} />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={state.strings.name}
                value={state.name}
                left={<TextInput.Icon style={styles.inputIcon} icon="account" />}
                onChangeText={value => actions.setName(value)}
              />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={state.strings.location}
                value={state.location}
                left={<TextInput.Icon style={styles.inputIcon} icon="map-marker-outline" />}
                onChangeText={value => actions.setLocation(value)}
              />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={state.strings.description}
                value={state.description}
                left={<TextInput.Icon style={styles.inputIcon} icon="book-open-outline" />}
                onChangeText={value => actions.setDescription(value)}
              />
            </Surface> 
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    </>
  );
}
