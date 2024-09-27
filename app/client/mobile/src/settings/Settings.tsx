import React, {useState} from 'react';
import {
  Surface,
  Button,
  Text,
  IconButton,
  Divider,
  Icon,
  TextInput,
  RadioButton,
  Switch,
} from 'react-native-paper';
import {
  SafeAreaView,
  TouchableOpacity,
  Modal,
  View,
  Image,
  ScrollView,
} from 'react-native';
import {styles} from './Settings.styled';
import {useSettings} from './useSettings.hook';
import ImagePicker from 'react-native-image-crop-picker';
import {BlurView} from '@react-native-community/blur';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors} from '../constants/Colors';
import {InputCode} from '../utils/InputCode';
import Clipboard from '@react-native-clipboard/clipboard';

export function Settings({showLogout}: {showLogout: boolean}) {
  const {state, actions} = useSettings();
  const [alert, setAlert] = useState(false);
  const [details, setDetails] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [auth, setAuth] = useState(false);
  const [clear, setClear] = useState(false);
  const [change, setChange] = useState(false);
  const [logout, setLogout] = useState(false);
  const [remove, setRemove] = useState(false);
  const [applyingLogout, setApplyingLogout] = useState(false);
  const [applyingRemove, setApplyingRemove] = useState(false);
  const [sealDelete, setSealDelete] = useState(false);
  const [sealReset, setSealReset] = useState(false);
  const [sealConfig, setSealConfig] = useState(false);
  const [savingAuth, setSavingAuth] = useState(false);
  const [savingSeal, setSavingSeal] = useState(false);
  const [savingChange, setSavingChange] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingRegistry, setSavingRegistry] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [secretCopy, setSecretCopy] = useState(false);
  const [confirmingAuth, setConfirmingAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const changeLogin = () => {
    actions.setPassword('');
    actions.setConfirm('');
    setChange(true);
  };

  const saveChange = async () => {
    if (!savingChange) {
      setSavingChange(true);
      try {
        await actions.setLogin();
        setChange(false);
      } catch (err) {
        console.log(err);
        setChange(false);
        setAlert(true);
      }
      setSavingChange(false);
    }
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
    }
  };

  const applyRemove = async () => {
    if (!applyingRemove) {
      setApplyingRemove(true);
      try {
        await actions.remove();
        setRemove(false);
      } catch (err) {
        console.log(err);
        setRemove(false);
        setAlert(true);
      }
      setApplyingRemove(false);
    }
  };

  const applyLogout = async () => {
    if (!applyingLogout) {
      setApplyingLogout(true);
      try {
        await actions.logout();
        setLogout(false);
      } catch (err) {
        console.log(err);
        setLogout(false);
        setAlert(true);
      }
      setApplyingLogout(false);
    }
  };

  const setMfa = async (flag: boolean) => {
    if (!savingAuth) {
      setSavingAuth(true);
      try {
        if (flag) {
          await actions.enableMFA();
          setAuthMessage('');
          actions.setCode('');
          setAuth(true);
        } else {
          setClear(true);
        }
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSavingAuth(false);
    }
  };

  const clearAuth = async () => {
    if (!confirmingAuth) {
      setConfirmingAuth(true);
      try {
        await actions.disableMFA();
        setClear(false);
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setConfirmingAuth(false);
    }
  };

  const confirmAuth = async () => {
    if (!confirmingAuth) {
      setConfirmingAuth(true);
      try {
        await actions.confirmMFA();
        setAuth(false);
      } catch (err) {
        if (err.message === '401') {
          setAuthMessage(state.strings.mfaError);
        } else if (err.message === '429') {
          setAuthMessage(state.strings.mfaDisabled);
        } else {
          setAuthMessage(`${state.strings.error}: ${state.strings.tryAgain}`);
        }
      }
      setConfirmingAuth(false);
    }
  };

  const copySecret = async () => {
    if (!secretCopy) {
      setSecretCopy(true);
      Clipboard.setString(state.secretText);
      setTimeout(() => {
        setSecretCopy(false);
      }, 2000);
    }
  };

  const setSeal = async () => {
    if (!savingSeal) {
      setSealDelete(false);
      setSealReset(false);
      setSealConfig(false);
      actions.setSealPassword('');
      actions.setSealConfirm('');
      actions.setSealDelete('');
      setSealing(true);
    }
  };

  const sealUnlock = async () => {
    if (!savingSeal) {
      setSavingSeal(true);
      try {
        await actions.unlockSeal();
        setSealing(false);
      } catch (err) {
        console.log(err);
        setSealing(false);
        setAlert(true);
      }
      setSavingSeal(false);
    }
  };

  const sealForget = async () => {
    if (!savingSeal) {
      setSavingSeal(true);
      try {
        await actions.forgetSeal();
        setSealing(false);
      } catch (err) {
        console.log(err);
        setSealing(false);
        setAlert(true);
      }
      setSavingSeal(false);
    }
  };

  const sealRemove = async () => {
    if (!savingSeal) {
      setSavingSeal(true);
      try {
        await actions.clearSeal();
        setSealing(false);
      } catch (err) {
        console.log(err);
        setSealing(false);
        setAlert(true);
      }
      setSavingSeal(false);
    }
  };

  const sealCreate = async () => {
    if (!savingSeal) {
      setSavingSeal(true);
      try {
        await actions.setSeal();
        setSealing(false);
      } catch (err) {
        console.log(err);
        setSealing(false);
        setAlert(true);
      }
      setSavingSeal(false);
    }
  };

  const sealUpdate = async () => {
    if (!savingSeal) {
      setSavingSeal(true);
      try {
        await actions.updateSeal();
        setSealing(false);
      } catch (err) {
        console.log(err);
        setSealing(false);
        setAlert(true);
      }
      setSavingSeal(false);
    }
  };

  const saveDetails = async () => {
    if (!savingDetails) {
      setSavingDetails(true);
      try {
        await actions.setDetails();
        setDetails(false);
      } catch (err) {
        console.log(err);
        setDetails(false);
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

  const setNotifications = async (flag: boolean) => {
    if (!savingNotifications) {
      setSavingNotifications(true);
      try {
        if (flag) {
          await actions.enableNotifications();
        } else {
          await actions.disableNotifications();
        }
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSavingNotifications(false);
    }
  };

  return (
    <>
      <ScrollView bounces={false}>
        <SafeAreaView style={styles.settings}>
          <Text
            style={styles.header}
            adjustsFontSizeToFit={true}
            numberOfLines={1}>{`${state.profile.handle}${
            state.profile.node ? '/' + state.profile.node : ''
          }`}</Text>
          <View style={styles.image}>
            {!state.profile.imageSet && (
              <Image
                style={styles.logoUnset}
                resizeMode={'contain'}
                source={{uri: state.imageUrl}}
              />
            )}
            {state.profile.imageSet && (
              <Image
                style={styles.logoSet}
                resizeMode={'contain'}
                source={{uri: state.imageUrl}}
              />
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
              <Text
                style={styles.nameSet}
                adjustsFontSizeToFit={true}
                numberOfLines={1}>
                {state.profile.name}
              </Text>
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
                <Text style={styles.labelUnset}>
                  {state.strings.description}
                </Text>
              )}
              {state.profile.description && (
                <Text style={styles.labelSet}>{state.profile.description}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.editDetails}
              onPress={() => setDetails(true)}>
              <Surface elevation={4} mode="flat">
                <Text style={styles.editDetailsLabel}>
                  {state.strings.edit}
                </Text>
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
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setRegistry(!state.config.searchable)}>
                  <Text style={styles.controlLabel}>
                    {state.strings.visibleRegistry}
                  </Text>
                </TouchableOpacity>
                <Switch
                  style={styles.controlSwitch}
                  value={state.config.searchable}
                  onValueChange={setRegistry}
                />
              </View>
            </View>
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="cloud-lock-outline" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity activeOpacity={1} onPress={setSeal}>
                  <Text style={styles.controlLabel}>
                    {state.strings.manageTopics}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="bell-outline" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setRegistry(!state.config.pushEnabled)}>
                  <Text style={styles.controlLabel}>
                    {state.strings.enableNotifications}
                  </Text>
                </TouchableOpacity>
                <Switch
                  style={styles.controlSwitch}
                  value={state.config.pushEnabled}
                  onValueChange={setNotifications}
                />
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
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setRegistry(!state.config.searchable)}>
                  <Text style={styles.controlLabel}>
                    {state.strings.mfaTitle}
                  </Text>
                </TouchableOpacity>
                <Switch
                  style={styles.controlSwitch}
                  value={state.config.mfaEnabled}
                  onValueChange={setMfa}
                />
              </View>
            </View>
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="login" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity activeOpacity={1} onPress={changeLogin}>
                  <Text style={styles.controlLabel}>
                    {state.strings.changeLogin}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {showLogout && (
              <View style={styles.attribute}>
                <View style={styles.controlIcon}>
                  <Icon size={24} source="logout" />
                </View>
                <View style={styles.control}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setLogout(true)}>
                    <Text style={styles.controlLabel}>
                      {state.strings.logout}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="account-remove" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setRemove(true)}>
                  <Text style={styles.dangerLabel}>
                    {state.strings.deleteAccount}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.divider}>
            <Divider style={styles.line} bold={true} />
          </View>
          <View style={styles.attributes}>
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="account-cancel-outline" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity activeOpacity={1} onPress={() => manageSeal}>
                  <Text style={styles.controlLabel}>
                    {state.strings.blockedContacts}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="archive-cancel-outline" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity activeOpacity={1} onPress={() => manageSeal}>
                  <Text style={styles.controlLabel}>
                    {state.strings.blockedTopics}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.attribute}>
              <View style={styles.controlIcon}>
                <Icon size={24} source="file-cancel-outline" />
              </View>
              <View style={styles.control}>
                <TouchableOpacity activeOpacity={1} onPress={() => manageSeal}>
                  <Text style={styles.controlLabel}>
                    {state.strings.blockedMessages}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.divider}>
            <Divider style={styles.line} bold={true} />
          </View>
          <View style={styles.options}>
            <View style={styles.attribute}>
              <View style={styles.radioIcon}>
                <Icon size={24} source="clock-outline" />
              </View>
              <View style={styles.radioControl}>
                <Text style={styles.label}>{state.strings.timeFormat}:</Text>
                <View style={styles.radioButtons}>
                  <RadioButton.Item
                    label={state.strings.timeHalf}
                    labelStyle={styles.option}
                    mode="android"
                    status={state.fullDayTime ? 'unchecked' : 'checked'}
                    onPress={() => {
                      actions.setFullDayTime(false);
                    }}
                  />
                  <RadioButton.Item
                    label={state.strings.timeFull}
                    labelStyle={styles.option}
                    mode="android"
                    status={state.fullDayTime ? 'checked' : 'unchecked'}
                    onPress={() => {
                      actions.setFullDayTime(true);
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={styles.attribute}>
              <View style={styles.radioIcon}>
                <Icon size={24} source="calendar-text-outline" />
              </View>
              <View style={styles.radioControl}>
                <Text style={styles.label}>{state.strings.dateFormat}:</Text>
                <View style={styles.radioButtons}>
                  <RadioButton.Item
                    label={state.strings.monthStart}
                    labelStyle={styles.option}
                    mode="android"
                    status={state.monthFirstDate ? 'checked' : 'unchecked'}
                    onPress={() => {
                      actions.setMonthFirstDate(true);
                    }}
                  />
                  <RadioButton.Item
                    label={state.strings.monthEnd}
                    labelStyle={styles.option}
                    mode="android"
                    status={state.monthFirstDate ? 'unchecked' : 'checked'}
                    onPress={() => {
                      actions.setMonthFirstDate(false);
                    }}
                  />
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
        visible={sealing}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => setSealing(false)}>
        <View style={styles.modal}>
          <BlurView
            style={styles.blur}
            blurType="dark"
            blurAmount={2}
            reducedTransparencyFallbackColor="dark"
          />
          <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.content}>
            <Surface elevation={5} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>
                {state.strings.manageTopics}
              </Text>
              <IconButton
                style={styles.modalClose}
                icon="close"
                size={24}
                onPress={() => setSealing(false)}
              />
              {!sealDelete &&
                !sealReset &&
                state.config.sealSet &&
                state.config.sealUnlocked && (
                  <>
                    <Text style={styles.modalDescription}>
                      {state.strings.sealUnlocked}
                    </Text>
                    {!sealConfig && (
                      <View style={styles.modalControls}>
                        <IconButton
                          style={styles.modalOption}
                          iconColor={Colors.primary}
                          icon="menu-right-outline"
                          size={32}
                          onPress={() => {
                            setSealConfig(true);
                          }}
                        />
                        <Button
                          mode="outlined"
                          onPress={() => setSealing(false)}>
                          {state.strings.cancel}
                        </Button>
                        <Button
                          mode="contained"
                          loading={savingSeal}
                          onPress={sealForget}>
                          {state.strings.disable}
                        </Button>
                      </View>
                    )}
                    {sealConfig && (
                      <View style={styles.modalControls}>
                        <Button
                          mode="contained"
                          onPress={() => setSealReset(true)}>
                          {state.strings.update}
                        </Button>
                        <Button
                          mode="contained"
                          style={styles.deleteButton}
                          loading={savingSeal}
                          onPress={() => setSealDelete(true)}>
                          {state.strings.delete}
                        </Button>
                        <IconButton
                          style={styles.modalOption}
                          iconColor={Colors.primary}
                          icon="menu-left-outline"
                          size={32}
                          onPress={() => {
                            setSealConfig(false);
                          }}
                        />
                      </View>
                    )}
                  </>
                )}
              {!sealDelete &&
                sealReset &&
                state.config.sealSet &&
                state.config.sealUnlocked && (
                  <>
                    <Text style={styles.modalDescription}>
                      {state.strings.changePassword}
                    </Text>
                    <TextInput
                      style={styles.input}
                      mode="flat"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      value={state.sealPassword}
                      label={state.strings.password}
                      secureTextEntry={!showPassword}
                      left={<TextInput.Icon style={styles.icon} icon="lock" />}
                      right={
                        showPassword ? (
                          <TextInput.Icon
                            style={styles.icon}
                            icon="eye-off"
                            onPress={() => setShowPassword(false)}
                          />
                        ) : (
                          <TextInput.Icon
                            style={styles.icon}
                            icon="eye"
                            onPress={() => setShowPassword(true)}
                          />
                        )
                      }
                      onChangeText={value => actions.setSealPassword(value)}
                    />
                    <TextInput
                      style={styles.input}
                      mode="flat"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      value={state.sealConfirm}
                      label={state.strings.confirmPassword}
                      secureTextEntry={!showConfirm}
                      left={<TextInput.Icon style={styles.icon} icon="lock" />}
                      right={
                        showPassword ? (
                          <TextInput.Icon
                            style={styles.icon}
                            icon="eye-off"
                            onPress={() => setShowConfirm(false)}
                          />
                        ) : (
                          <TextInput.Icon
                            style={styles.icon}
                            icon="eye"
                            onPress={() => setShowConfirm(true)}
                          />
                        )
                      }
                      onChangeText={value => actions.setSealConfirm(value)}
                    />
                    <View style={styles.modalControls}>
                      <Button mode="outlined" onPress={() => setSealing(false)}>
                        {state.strings.cancel}
                      </Button>
                      <Button
                        mode="contained"
                        disabled={
                          state.sealPassword.length === 0 ||
                          state.sealConfirm !== state.sealPassword
                        }
                        loading={savingSeal}
                        onPress={sealUpdate}>
                        {state.strings.update}
                      </Button>
                    </View>
                  </>
                )}
              {!sealDelete &&
                state.config.sealSet &&
                !state.config.sealUnlocked && (
                  <>
                    <Text style={styles.modalDescription}>
                      {state.strings.sealLocked}
                    </Text>
                    <TextInput
                      style={styles.input}
                      mode="flat"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      value={state.sealPassword}
                      label={state.strings.password}
                      secureTextEntry={!showPassword}
                      left={<TextInput.Icon style={styles.icon} icon="lock" />}
                      right={
                        showPassword ? (
                          <TextInput.Icon
                            style={styles.icon}
                            icon="eye-off"
                            onPress={() => setShowPassword(false)}
                          />
                        ) : (
                          <TextInput.Icon
                            style={styles.icon}
                            icon="eye"
                            onPress={() => setShowPassword(true)}
                          />
                        )
                      }
                      onChangeText={value => actions.setSealPassword(value)}
                    />
                    {!sealConfig && (
                      <View style={styles.modalControls}>
                        <IconButton
                          style={styles.modalOption}
                          iconColor={Colors.primary}
                          icon="menu-right-outline"
                          size={32}
                          onPress={() => {
                            setSealConfig(true);
                          }}
                        />
                        <Button
                          mode="outlined"
                          onPress={() => setSealing(false)}>
                          {state.strings.cancel}
                        </Button>
                        <Button
                          mode="contained"
                          disabled={state.sealPassword.length === 0}
                          loading={savingSeal}
                          onPress={sealUnlock}>
                          {state.strings.unlock}
                        </Button>
                      </View>
                    )}
                    {sealConfig && (
                      <View style={styles.modalControls}>
                        <Button
                          mode="contained"
                          style={styles.deleteButton}
                          loading={savingSeal}
                          onPress={() => setSealDelete(true)}>
                          {state.strings.delete}
                        </Button>
                        <IconButton
                          style={styles.modalOption}
                          iconColor={Colors.primary}
                          icon="menu-left-outline"
                          size={32}
                          onPress={() => {
                            setSealConfig(false);
                          }}
                        />
                      </View>
                    )}
                  </>
                )}
              {sealDelete && state.config.sealSet && (
                <>
                  <Text style={styles.modalDescription}>
                    {state.strings.sealDelete}
                  </Text>
                  <TextInput
                    style={styles.input}
                    mode="flat"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    value={state.sealDelete}
                    label={state.strings.typeDelete}
                    left={<TextInput.Icon style={styles.icon} icon="lock" />}
                    onChangeText={value => actions.setSealDelete(value)}
                  />
                  <View style={styles.modalControls}>
                    <Button
                      mode="contained"
                      style={styles.deleteButton}
                      disabled={state.sealDelete !== state.strings.deleteKey}
                      loading={savingSeal}
                      onPress={sealRemove}>
                      {state.strings.delete}
                    </Button>
                  </View>
                </>
              )}
              {!state.config.sealSet && (
                <>
                  <Text style={styles.modalDescription}>
                    {state.strings.sealUnset}
                  </Text>
                  <Text style={styles.modalDescription}>
                    {state.strings.delayMessage}
                  </Text>
                  <TextInput
                    style={styles.input}
                    mode="flat"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    value={state.sealPassword}
                    label={state.strings.password}
                    secureTextEntry={!showPassword}
                    left={<TextInput.Icon style={styles.icon} icon="lock" />}
                    right={
                      showPassword ? (
                        <TextInput.Icon
                          style={styles.icon}
                          icon="eye-off"
                          onPress={() => setShowPassword(false)}
                        />
                      ) : (
                        <TextInput.Icon
                          style={styles.icon}
                          icon="eye"
                          onPress={() => setShowPassword(true)}
                        />
                      )
                    }
                    onChangeText={value => actions.setSealPassword(value)}
                  />
                  <View style={styles.modalControls}>
                    <Button mode="outlined" onPress={() => setSealing(false)}>
                      {state.strings.cancel}
                    </Button>
                    <Button
                      mode="contained"
                      disabled={state.sealPassword.length === 0}
                      loading={savingSeal}
                      onPress={sealCreate}>
                      {state.strings.save}
                    </Button>
                  </View>
                </>
              )}
            </Surface>
          </KeyboardAwareScrollView>
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
          <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.content}>
            <Surface elevation={1} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.editDetails}</Text>
              <IconButton
                style={styles.modalClose}
                icon="close"
                size={24}
                onPress={() => setDetails(false)}
              />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={state.strings.name}
                value={state.name}
                left={
                  <TextInput.Icon style={styles.inputIcon} icon="account" />
                }
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
                left={
                  <TextInput.Icon
                    style={styles.inputIcon}
                    icon="map-marker-outline"
                  />
                }
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
                left={
                  <TextInput.Icon
                    style={styles.inputIcon}
                    icon="book-open-outline"
                  />
                }
                onChangeText={value => actions.setDescription(value)}
              />

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setDetails(false)}>
                  {state.strings.cancel}
                </Button>
                <Button
                  mode="contained"
                  loading={savingDetails}
                  onPress={saveDetails}>
                  {state.strings.save}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
        visible={auth}
        onRequestClose={() => setAuth(false)}>
        <View style={styles.modal}>
          <BlurView
            style={styles.blur}
            blurType="dark"
            blurAmount={2}
            reducedTransparencyFallbackColor="dark"
          />
          <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.content}>
            <Surface elevation={5} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.mfaTitle}</Text>
              <IconButton
                style={styles.modalClose}
                icon="close"
                size={24}
                onPress={() => setAuth(false)}
              />
              <Text style={styles.modalDescription}>
                {state.strings.mfaSteps}
              </Text>
              <Image
                style={styles.secretImage}
                resizeMode={'contain'}
                source={{uri: state.secretImage}}
              />

              <View style={styles.secretText}>
                <Text
                  style={styles.secret}
                  selectable={true}
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}>
                  {state.secretText}
                </Text>
                <TouchableOpacity onPress={copySecret}>
                  <Icon
                    style={styles.secretIcon}
                    size={18}
                    source={secretCopy ? 'check' : 'content-copy'}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <InputCode onChangeText={actions.setCode} />

              <View style={styles.authMessage}>
                <Text style={styles.authMessageText}>{authMessage}</Text>
              </View>

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setAuth(false)}>
                  {state.strings.cancel}
                </Button>
                <Button
                  mode="contained"
                  loading={confirmingAuth}
                  disabled={state.code.length !== 6}
                  onPress={confirmAuth}>
                  {state.strings.mfaConfirm}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
        visible={clear}
        onRequestClose={() => setClear(false)}>
        <View style={styles.modal}>
          <BlurView
            style={styles.blur}
            blurType="dark"
            blurAmount={2}
            reducedTransparencyFallbackColor="dark"
          />
          <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.content}>
            <Surface elevation={5} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.mfaTitle}</Text>
              <IconButton
                style={styles.modalClose}
                icon="close"
                size={24}
                onPress={() => setClear(false)}
              />
              <Text style={styles.modalDescription}>
                {state.strings.disablePrompt}
              </Text>

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setClear(false)}>
                  {state.strings.cancel}
                </Button>
                <Button
                  mode="contained"
                  loading={confirmingAuth}
                  onPress={clearAuth}>
                  {state.strings.disable}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
        visible={change}
        onRequestClose={() => setChange(false)}>
        <View style={styles.modal}>
          <BlurView
            style={styles.blur}
            blurType="dark"
            blurAmount={2}
            reducedTransparencyFallbackColor="dark"
          />
          <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.content}>
            <Surface elevation={5} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.changeLogin}</Text>
              <IconButton
                style={styles.modalClose}
                icon="close"
                size={24}
                onPress={() => setChange(false)}
              />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={state.strings.username}
                value={state.handle}
                left={
                  <TextInput.Icon style={styles.inputIcon} icon="account" />
                }
                right={
                  !state.checked ? (
                    <TextInput.Icon style={styles.icon} icon="refresh" />
                  ) : state.taken ? (
                    <TextInput.Icon
                      style={styles.icon}
                      color={Colors.danger}
                      icon="account-cancel-outline"
                    />
                  ) : (
                    <></>
                  )
                }
                onChangeText={value => actions.setHandle(value)}
              />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                value={state.password}
                label={state.strings.password}
                secureTextEntry={!showPassword}
                left={<TextInput.Icon style={styles.icon} icon="lock" />}
                right={
                  showPassword ? (
                    <TextInput.Icon
                      style={styles.icon}
                      icon="eye-off"
                      onPress={() => setShowPassword(false)}
                    />
                  ) : (
                    <TextInput.Icon
                      style={styles.icon}
                      icon="eye"
                      onPress={() => setShowPassword(true)}
                    />
                  )
                }
                onChangeText={value => actions.setPassword(value)}
              />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                value={state.confirm}
                label={state.strings.confirmPassword}
                secureTextEntry={!showConfirm}
                left={<TextInput.Icon style={styles.icon} icon="lock" />}
                right={
                  showPassword ? (
                    <TextInput.Icon
                      style={styles.icon}
                      icon="eye-off"
                      onPress={() => setShowConfirm(false)}
                    />
                  ) : (
                    <TextInput.Icon
                      style={styles.icon}
                      icon="eye"
                      onPress={() => setShowConfirm(true)}
                    />
                  )
                }
                onChangeText={value => actions.setConfirm(value)}
              />

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setChange(false)}>
                  {state.strings.cancel}
                </Button>
                <Button
                  mode="contained"
                  loading={savingChange}
                  disabled={
                    state.password === '' ||
                    state.password !== state.confirm ||
                    state.taken ||
                    !state.checked
                  }
                  onPress={saveChange}>
                  {state.strings.update}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
        visible={logout}
        onRequestClose={() => setLogout(false)}>
        <View style={styles.modal}>
          <BlurView
            style={styles.blur}
            blurType="dark"
            blurAmount={2}
            reducedTransparencyFallbackColor="dark"
          />
          <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.content}>
            <Surface elevation={5} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.loggingOut}</Text>
              <IconButton
                style={styles.modalClose}
                icon="close"
                size={24}
                onPress={() => setLogout(false)}
              />

              <View style={styles.allControl}>
                <Text style={styles.controlLabel}>
                  {state.strings.allDevices}
                </Text>
                <Switch
                  style={styles.controlSwitch}
                  value={state.all}
                  onValueChange={actions.setAll}
                />
              </View>

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setLogout(false)}>
                  {state.strings.cancel}
                </Button>
                <Button
                  mode="contained"
                  loading={applyingLogout}
                  onPress={applyLogout}>
                  {state.strings.logout}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
        visible={remove}
        onRequestClose={() => setRemove(false)}>
        <View style={styles.modal}>
          <BlurView
            style={styles.blur}
            blurType="dark"
            blurAmount={2}
            reducedTransparencyFallbackColor="dark"
          />
          <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.content}>
            <Surface elevation={5} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>
                {state.strings.deleteAccount}
              </Text>
              <IconButton
                style={styles.modalClose}
                icon="close"
                size={24}
                onPress={() => setRemove(false)}
              />

              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                value={state.remove}
                label={state.strings.typeDelete}
                left={
                  <TextInput.Icon style={styles.icon} icon="delete-outline" />
                }
                onChangeText={value => actions.setRemove(value)}
              />

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setRemove(false)}>
                  {state.strings.cancel}
                </Button>
                <Button
                  mode="contained"
                  loading={applyingRemove}
                  disabled={state.remove !== state.strings.deleteKey}
                  style={styles.remove}
                  onPress={applyRemove}>
                  {state.strings.delete}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    </>
  );
}
