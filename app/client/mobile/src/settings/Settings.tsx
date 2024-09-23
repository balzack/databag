import React, {useState, useContext} from 'react';
import {Surface, Button, Text, IconButton, Divider, Icon, TextInput, RadioButton, Switch} from 'react-native-paper';
import {SafeAreaView, TouchableOpacity, Modal, View, Image, ScrollView} from 'react-native';
import {styles} from './Settings.styled';
import {useSettings} from './useSettings.hook';
import ImagePicker from 'react-native-image-crop-picker';
import {BlurView} from '@react-native-community/blur';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export function Settings({ showLogout }: { showLogout: boolean }) {
  const { state, actions } = useSettings();
  const [alert, setAlert] = useState(false);
  const [details, setDetails] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingRegistry, setSavingRegistry] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);

  const selectImage = async () => {
    try {
      const img = await ImagePicker.openPicker({ mediaType: 'photo', width: 256, height: 256, cropping: true, cropperCircleOverlay: true, includeBase64: true });
      try {
        await actions.setProfileImage(img.data);
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

  const saveDetails = async () => {
    if (!savingDetails) {
      setSavingDetails(true);
      try {
        await actions.setDetails();
        setDetails(false);
      }
      catch (err) {
        console.log(err);
        setDetails(false);
        setAlert(true);
      }
      setSavingDetails(false);
    }
  }

  const setRegistry = async (flag: boolean) => {
    if (!savingRegistry) {
      setSavingRegistry(true);
      try {
        if (flag) {
          await actions.enableRegistry();
        } else {
          await actions.disableRegistry();
        }
      }
      catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSavingRegistry(false);
    }
  }

  const setNotifications = async (flag: boolean) => {
    if (!savingNotifications) {
      setSavingNotifications(true);
      try {
        if (flag) {
          await actions.enableNotifications();
        } else {
          await actions.disableNotifications();
        }
      }
      catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSavingNotifications(false);
    }
  }

  return (
    <>
      <ScrollView bounces={false}>
        <SafeAreaView style={styles.settings}>
          <Text style={styles.header} adjustsFontSizeToFit={true} numberOfLines={1}>{`${state.profile.handle}${state.profile.node ? '/' + state.profile.node : ''}`}</Text>
          <View style={styles.image}>
            {!state.profile.imageSet && (
              <Image style={styles.logoUnset} resizeMode={'contain'} source={{ uri: state.imageUrl }} />
            )}
            {state.profile.imageSet && (
              <Image style={styles.logoSet} resizeMode={'contain'} source={{ uri: state.imageUrl }} />
            )}
            <View style={styles.editBar}>
              <TouchableOpacity onPress={selectImage}>
                <Surface style={styles.editBorder} elevation={0}>
                  <Text style={styles.editLogo}>{state.strings.edit}</Text>
                </Surface>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider}>
            <Divider style={styles.line} bold={true} />
          </View>

          <View style={styles.attributes}>
            {!state.profile.name && (
              <Text style={styles.nameUnset}>{state.strings.name}</Text>
            )}
            {state.profile.name && (
              <Text style={styles.nameSet} adjustsFontSizeToFit={true} numberOfLines={1}>{state.profile.name}</Text>
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
            <TouchableOpacity style={styles.editDetails} onPress={() => setDetails(true)}>
              <Surface elevation={4} mode="flat">
                <Text style={styles.editDetailsLabel}>{state.strings.edit}</Text>
              </Surface>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <Divider style={styles.line} bold={true} />
          </View>
          <View style={styles.attributes}>
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="eye-outline" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity activeOpacity={1} onPress={() => setRegistry(!state.config.searchable)}>
                  <Text style={styles.controlLabel}>{state.strings.visibleRegistry}</Text>
                </TouchableOpacity>
                <Switch style={styles.controlSwitch} value={state.config.searchable} onValueChange={setRegistry} />
              </View>
            </View>
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="cloud-lock-outline" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity activeOpacity={1} onPress={() => manageSeal}>
                  <Text style={styles.controlLabel}>{state.strings.manageTopics}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="bell-outline" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity activeOpacity={1} onPress={() => setRegistry(!state.config.pushEnabled)}>
                  <Text style={styles.controlLabel}>{state.strings.enableNotifications}</Text>
                </TouchableOpacity>
                <Switch style={styles.controlSwitch} value={state.config.pushEnabled} onValueChange={setRegistry} />
              </View>
            </View>
          </View>

          <View style={styles.divider}>
            <Divider style={styles.line} bold={true} />
          </View>
          <View style={styles.attributes}>
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="ticket-confirmation-outline" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity activeOpacity={1} onPress={() => setRegistry(!state.config.searchable)}>
                  <Text style={styles.controlLabel}>{state.strings.mfaTitle}</Text>
                </TouchableOpacity>
                <Switch style={styles.controlSwitch} value={state.config.searchable} onValueChange={setRegistry} />
              </View>
            </View>
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="login" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity activeOpacity={1} onPress={() => manageSeal}>
                  <Text style={styles.controlLabel}>{state.strings.changeLogin}</Text>
                </TouchableOpacity>
              </View>
            </View>
            { showLogout && (
              <View style={styles.attribute}>
                <View style={styles.controlIcon}>
                  <Icon size={24} source="logout" />
                </View>
                <View style={styles.control}>
                  <TouchableOpacity activeOpacity={1} onPress={() => manageSeal}>
                    <Text style={styles.controlLabel}>{state.strings.logout}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="account-remove" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity activeOpacity={1} onPress={() => manageSeal}>
                  <Text style={styles.dangerLabel}>{state.strings.deleteAccount}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
 
          <View style={styles.divider}>
            <Divider style={styles.line} bold={true} />
          </View>
          <View style={styles.options}>
            <View style={styles.attribute}>
              <View style={styles.icon}>
                <Icon size={24} source="clock-outline" />
              </View>
              <View style={styles.radioControl}>
                <Text style={styles.label}>{state.strings.timeFormat}:</Text>
                <View style={styles.radioButtons}>
                  <RadioButton.Item label={state.strings.timeHalf} mode="android" status={state.fullDayTime ? 'unchecked' : 'checked'} onPress={() => {actions.setFullDayTime(false)}} />
                  <RadioButton.Item label={state.strings.timeFull} mode="android" status={state.fullDayTime ? 'checked' : 'unchecked'} onPress={() => {actions.setFullDayTime(true)}} />
                </View>
              </View>
            </View>
            <View style={styles.attribute}>
              <View style={styles.icon}>
                <Icon size={24} source="calendar-text-outline" />
              </View>
              <View style={styles.radioControl}>
                <Text style={styles.label}>{state.strings.dateFormat}:</Text>
                <View style={styles.radioButtons}>
                  <RadioButton.Item label={state.strings.monthStart} mode="android" status={state.monthFirstDate ? 'checked' : 'unchecked'} onPress={() => {actions.setMonthFirstDate(true)}} />
                  <RadioButton.Item label={state.strings.monthEnd} mode="android" status={state.monthFirstDate ? 'unchecked' : 'checked'} onPress={() => {actions.setMonthFirstDate(false)}} />
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={alert}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => setAlert(false)}>
        <View style={styles.modal}>
          <BlurView
            style={styles.blur}
            blurType="dark"
            blurAmount={2}
            reducedTransparencyFallbackColor="dark"
          />
          <View style={styles.content}>
            <Surface elevation={1} mode="flat" style={styles.surface}>
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

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setDetails(false)}>{ state.strings.cancel }</Button>
                <Button mode="contained" loading={savingDetails} onPress={saveDetails}>{ state.strings.save }</Button>
              </View>
            </Surface> 
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    </>
  );
}
