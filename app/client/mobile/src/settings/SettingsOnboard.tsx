import React, {useState, useEffect, useRef} from 'react';
import {useTheme, Surface, Button, Text, Divider, Icon, TextInput, Switch} from 'react-native-paper';
import {useAnimatedValue, Animated, Pressable, View, Image} from 'react-native';
import {styles} from './Settings.styled';
import {useSettings} from './useSettings.hook';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Confirm} from '../confirm/Confirm';
import {SafeAreaView} from 'react-native-safe-area-context';

export function SettingsOnboard({back, next}: {back: () => void; next: () => void}) {
  const {state, actions} = useSettings();
  const [alert, setAlert] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingRegistry, setSavingRegistry] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const theme = useTheme();
  const descriptionRef = useRef();
  const profile = useAnimatedValue(0);

  useEffect(() => {
    if (state.profileSet) {
      Animated.timing(profile, {
        toValue: 1,
        duration: 333,
        useNativeDriver: false,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.profileSet]);

  const errParams = {
    title: state.strings.operationFailed,
    prompt: state.strings.appPermission,
    close: {
      label: state.strings.close,
      action: () => {
        setMediaError(false);
      },
    },
  };

  const alertParams = {
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    close: {
      label: state.strings.close,
      action: () => {
        setAlert(false);
      },
    },
  };

  const selectImage = async () => {
    try {
      const img = await ImagePicker.openPicker({
        mediaType: 'photo',
        width: 256,
        height: 256,
        cropping: true,
        cropperCircleOverlay: true,
        includeBase64: true,
      });
      try {
        await actions.setProfileImage(img.data);
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
    } catch (err) {
      console.log(err);
      if (err.message === 'User did not grant library permission.') {
        setMediaError(true);
      }
    }
  };

  const saveDetails = async () => {
    if (!savingDetails) {
      setSavingDetails(true);
      try {
        await actions.setDetails();
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSavingDetails(false);
    }
  };

  const setRegistry = async (flag: boolean) => {
    if (!savingRegistry) {
      setSavingRegistry(true);
      try {
        if (flag) {
          await actions.enableRegistry();
        } else {
          await actions.disableRegistry();
        }
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSavingRegistry(false);
    }
  };

  return (
    <View>
      <View style={styles.settings}>
        <Surface elevation={9} mode="flat" style={styles.navHeader}>
          <Pressable style={styles.navIcon} onPress={back}>
            <Icon size={24} source="left" color={'white'} />
          </Pressable>
          <Text style={styles.smLabel}>{state.strings.yourProfile}</Text>
          <View style={styles.navIcon} />
        </Surface>
        <Animated.View style={[styles.navImage, {opacity: profile}]}>
          <Image style={styles.navLogo} resizeMode={'contain'} source={{uri: state.imageUrl}} />
          <Surface style={styles.overlap} elevation={2} mode="flat" />
        </Animated.View>
        <Animated.View style={[styles.scrollWrapper, {opacity: profile}]}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.imageSpacer} />
            <Surface mode="flat" elevation={2} style={styles.surfaceMaxWidth}>
              <SafeAreaView style={styles.navForm} edges={['left', 'right']}>
                <View style={styles.navWrapper}>
                  <Surface elevation={0} mode="flat" style={styles.navData}>
                    <TextInput
                      style={styles.navInput}
                      mode="outlined"
                      outlineStyle={styles.navInputBorder}
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      returnKeyType="done"
                      placeholder={state.strings.enterName}
                      placeholderTextColor={theme.colors.secondary}
                      value={state.name}
                      left={<TextInput.Icon style={styles.icon} size={22} icon="idcard" />}
                      onChangeText={value => actions.setName(value)}
                      onSubmitEditing={saveDetails}
                      onBlur={saveDetails}
                    />
                    <Divider style={styles.navDivider} />
                    <View style={styles.navUpload}>
                      <TextInput
                        style={styles.navInput}
                        mode="outlined"
                        outlineStyle={styles.navInputBorder}
                        placeholder={state.strings.uploadImage}
                        left={<TextInput.Icon style={styles.icon} size={22} icon="picture" />}
                      />
                      <Pressable style={styles.navPress} onPress={selectImage} />
                    </View>
                    <Divider style={styles.navDivider} />
                    <TextInput
                      style={styles.navInput}
                      mode="outlined"
                      outlineStyle={styles.navInputBorder}
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      returnKeyType="done"
                      placeholder={state.strings.yourLocation}
                      placeholderTextColor={theme.colors.secondary}
                      value={state.location}
                      left={<TextInput.Icon style={styles.icon} size={22} icon="map-pin" />}
                      onChangeText={value => actions.setLocation(value)}
                      onSubmitEditing={saveDetails}
                      onBlur={saveDetails}
                    />
                    <Divider style={styles.navDivider} />
                    <TextInput
                      ref={descriptionRef}
                      style={styles.navInput}
                      contentStyle={styles.navDescription}
                      mode="outlined"
                      multiline={true}
                      outlineStyle={styles.navInputBorder}
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      returnKeyType="done"
                      placeholder={state.strings.description}
                      value={state.description}
                      left={<TextInput.Icon style={styles.icon} size={22} icon="align-left" />}
                      onChangeText={value => actions.setDescription(value)}
                      blurOnSubmit={true}
                      scrollEnabled={false}
                      onSubmitEditing={saveDetails}
                      onBlur={saveDetails}
                    />
                    <Divider style={styles.navDivider} />
                    <View style={styles.navUpload}>
                      <TextInput
                        style={styles.navInput}
                        mode="outlined"
                        outlineStyle={styles.navInputBorder}
                        placeholder={state.strings.registry}
                        left={<TextInput.Icon style={styles.icon} size={22} icon="eye" />}
                      />
                      <View style={styles.controlAlign}>
                        <Switch style={styles.controlSwitch} value={state.searchable} disabled={savingRegistry} />
                      </View>
                      <Pressable style={styles.navPress} onPress={() => setRegistry(!state.config.searchable)} />
                    </View>
                  </Surface>
                </View>
                <Button mode="contained" style={styles.navSubmit} onPress={next}>
                  {state.strings.next}
                </Button>
                <Button mode="text" style={styles.navSkip} onPress={actions.clearWelcome}>
                  {state.strings.skipSetup}
                </Button>
              </SafeAreaView>
            </Surface>
          </KeyboardAwareScrollView>
        </Animated.View>
      </View>
      <Confirm show={alert} params={alertParams} />
      <Confirm show={mediaError} params={errParams} />
    </View>
  );
}
