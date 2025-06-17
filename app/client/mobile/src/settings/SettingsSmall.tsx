import React, {useState, useEffect, useRef} from 'react';
import {useTheme, Surface, Menu, Button, Text, IconButton, Divider, Icon, TextInput, RadioButton, Switch} from 'react-native-paper';
import {TouchableOpacity, useAnimatedValue, Animated, Pressable, Modal, View, Image, Platform, Linking} from 'react-native';
import {languages} from '../constants/Strings';
import {styles} from './Settings.styled';
import {useSettings} from './useSettings.hook';
import ImagePicker from 'react-native-image-crop-picker';
import {BlurView} from '@react-native-community/blur';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors} from '../constants/Colors';
import {InputCode} from '../utils/InputCode';
import Clipboard from '@react-native-clipboard/clipboard';
import {Confirm} from '../confirm/Confirm';
import Slider from '@react-native-community/slider';
import {SafeAreaView} from 'react-native-safe-area-context';
import {activateKeepAwake, deactivateKeepAwake} from '@sayem314/react-native-keep-awake';

export function SettingsSmall({setupNav}: {setupNav: {back: () => void; next: () => void}}) {
  const {state, actions} = useSettings();
  const [alert, setAlert] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [auth, setAuth] = useState(false);
  const [clear, setClear] = useState(false);
  const [change, setChange] = useState(false);
  const [logout, setLogout] = useState(false);
  const [remove, setRemove] = useState(false);
  const [language, setLanguage] = useState(false);
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
  const [blockedMessage, setBlockedMessage] = useState(false);
  const [blockedChannel, setBlockedChannel] = useState(false);
  const [blockedContact, setBlockedContact] = useState(false);
  const [blockedError, setBlockedError] = useState(false);
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

  const showBlockedMessage = async () => {
    setBlockedError(false);
    try {
      await actions.loadBlockedMessages();
    } catch (err) {
      console.log(err);
      setBlockedError(true);
    }
    setBlockedMessage(true);
  };

  const unblockMessage = async (blocked: {cardId: string | null; channelId: string; topicId: string; timestamp: number}) => {
    try {
      setBlockedError(false);
      await actions.unblockMessage(blocked.cardId, blocked.channelId, blocked.topicId);
    } catch (err) {
      console.log(err);
      setBlockedError(true);
    }
  };

  const blockedMessages = state.blockedMessages.map((blocked, index) => (
    <View key={index} style={{...styles.blockedItem, borderColor: theme.colors.outlineVariant}}>
      <Text style={styles.blockedValue}> {actions.getTimestamp(blocked.timestamp)}</Text>
      <IconButton style={styles.blockedAction} icon="restore" size={16} onPress={() => unblockMessage(blocked)} />
    </View>
  ));

  const showBlockedChannel = async () => {
    setBlockedError(false);
    try {
      await actions.loadBlockedChannels();
    } catch (err) {
      console.log(err);
      setBlockedError(true);
    }
    setBlockedChannel(true);
  };

  const unblockChannel = async (blocked: {cardId: string | null; channelId: string; topicId: string; timestamp: number}) => {
    try {
      setBlockedError(false);
      await actions.unblockChannel(blocked.cardId, blocked.channelId, blocked.topicId);
    } catch (err) {
      console.log(err);
      setBlockedError(true);
    }
  };

  const blockedChannels = state.blockedChannels.map((blocked, index) => (
    <View key={index} style={{...styles.blockedItem, borderColor: theme.colors.outlineVariant}}>
      <Text style={styles.blockedValue}> {actions.getTimestamp(blocked.timestamp)}</Text>
      <IconButton style={styles.blockedAction} icon="restore" size={16} onPress={() => unblockChannel(blocked)} />
    </View>
  ));

  const showBlockedContact = async () => {
    setBlockedError(false);
    try {
      await actions.loadBlockedContacts();
    } catch (err) {
      console.log(err);
      setBlockedError(true);
    }
    setBlockedContact(true);
  };

  const unblockContact = async (blocked: {cardId: string | null; channelId: string; topicId: string; timestamp: number}) => {
    try {
      setBlockedError(false);
      await actions.unblockContact(blocked.cardId, blocked.channelId, blocked.topicId);
    } catch (err) {
      console.log(err);
      setBlockedError(true);
    }
  };

  const blockedContacts = state.blockedContacts.map((blocked, index) => (
    <View key={index} style={{...styles.blockedItem, borderColor: theme.colors.outlineVariant}}>
      <Text style={styles.blockedValue}> {actions.getTimestamp(blocked.timestamp)}</Text>
      <IconButton style={styles.blockedAction} icon="restore" size={16} onPress={() => unblockContact(blocked)} />
    </View>
  ));

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

  const changeLogin = () => {
    actions.setPassword('');
    actions.setConfirm('');
    setChange(true);
  };

  const saveChange = async () => {
    if (!savingChange) {
      setSavingChange(true);
      try {
        actions.setLogin();
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
      activateKeepAwake();
      setSavingSeal(true);
      await new Promise(r => setTimeout(r, 1000));
      try {
        await actions.setSeal();
        setSealing(false);
      } catch (err) {
        console.log(err);
        setSealing(false);
        setAlert(true);
      }
      setSavingSeal(false);
      deactivateKeepAwake();
    }
  };

  const sealUpdate = async () => {
    if (!savingSeal) {
      setSavingSeal(true);
      await new Promise(r => setTimeout(r, 1000));
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

  const languageOptions = languages.map(item => (
    <Menu.Item
      key={item.value}
      onPress={() => {
        setLanguage(false);
        actions.setLanguage(item.value);
      }}
      trailingIcon={item.value === state.strings.code ? 'check' : undefined}
      title={item.name}
    />
  ));

  return (
    <View>
      <View style={styles.settings}>
        {setupNav && (
          <Surface elevation={9} mode="flat" style={styles.navHeader}>
            <Pressable style={styles.navIcon} onPress={setupNav?.back}>
              <Icon size={24} source="left" color={'white'} />
            </Pressable>
            <Text style={styles.smLabel}>
              {state.strings.yourProfile}
            </Text>
            <View style={styles.navIcon} />
          </Surface>
        )}
        {!setupNav && (
          <Surface mode="flat" elevation={9} style={styles.navHeader}>
            <Text style={styles.smHeader}>
              {state.strings.settings}
            </Text>
          </Surface>
        )}
        <Animated.View style={[styles.navImage, {opacity: profile}]}>
          <Image style={styles.navLogo} resizeMode={'contain'} source={{uri: state.imageUrl}} />
          <Surface style={styles.overlap} elevation={2} mode="flat" />
        </Animated.View>
        <Animated.View style={[styles.scrollWrapper, {opacity: profile}]}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.imageSpacer} />
            <Surface mode="flat" elevation={2} style={styles.surfaceMaxWidth}>
              <SafeAreaView style={styles.navForm} edges={['left', 'right']}>
                {!setupNav && (
                  <Text variant="headlineSmall" style={styles.sectionLabel}>
                    {state.strings.profile}
                  </Text>
                )}
                <View style={styles.navWrapper}>
                  <Surface elevation={0} mode="flat" style={styles.navData}>
                    {!setupNav && (
                      <TextInput
                        style={styles.navInput}
                        mode="outlined"
                        outlineStyle={styles.navInputBorder}
                        textColor={theme.colors.tertiary}
                        disabled={true}
                        value={`${state.profile.handle}${state.profile.node ? '@' + state.profile.node : ''}`}
                        left={<TextInput.Icon style={styles.icon} iconColor={theme.colors.tertiary} size={22} icon="user" />}
                      />
                    )}
                    {!setupNav && <Divider style={styles.navDivider} />}
                    <TextInput
                      style={styles.navInput}
                      mode="outlined"
                      outlineStyle={styles.navInputBorder}
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      returnKeyType="done"
                      placeholder={setupNav ? state.strings.enterName : state.strings.name}
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
                      placeholder={setupNav ? state.strings.yourLocation : state.strings.location}
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
                {setupNav && (
                  <Button mode="contained" style={styles.navSubmit} onPress={setupNav?.next}>
                    {state.strings.next}
                  </Button>
                )}
                {setupNav && (
                  <Button mode="text" style={styles.navSkip} onPress={actions.clearWelcome}>
                    {state.strings.skipSetup}
                  </Button>
                )}
                {!setupNav && (
                  <Text variant="headlineSmall" style={styles.sectionLabel}>
                    {state.strings.account}
                  </Text>
                )}
                {!setupNav && (
                  <View style={styles.navWrapper}>
                    <Surface elevation={0} mode="flat" style={styles.navData}>
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={state.strings.mfaTitle}
                          left={<TextInput.Icon style={styles.icon} size={22} icon="key" />}
                        />
                        <View style={styles.controlAlign}>
                          <Switch style={styles.controlSwitch} value={state.mfaEnabled} disabled={savingAuth} />
                        </View>
                        <Pressable style={styles.navPress} onPress={() => setMfa(!state.mfaEnabled)} />
                      </View>
                      <Divider style={styles.navDivider} />
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={state.strings.changeLogin}
                          left={<TextInput.Icon style={styles.icon} size={22} icon="sensor-occupied" />}
                        />
                        <Pressable style={styles.navPress} onPress={changeLogin} />
                      </View>
                      <Divider style={styles.navDivider} />
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={state.strings.logout}
                          left={<TextInput.Icon style={styles.icon} size={22} icon="logout" />}
                        />
                        <Pressable style={styles.navPress} onPress={() => setLogout(true)} />
                      </View>
                      <Divider style={styles.navDivider} />
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navInput}
                          textColor={theme.colors.error}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          value={state.strings.deleteAccount}
                          left={<TextInput.Icon style={styles.icon} color={theme.colors.error} size={22} icon="trash-2" />}
                        />
                        <Pressable style={styles.navPress} onPress={() => setRemove(true)} />
                      </View>
                    </Surface>
                  </View>
                )}
                {!setupNav && (
                  <Text variant="headlineSmall" style={styles.sectionLabel}>
                    {state.strings.messaging}
                  </Text>
                )}
                {!setupNav && (
                  <View style={styles.navWrapper}>
                    <Surface elevation={0} mode="flat" style={styles.navData}>
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={state.strings.enableNotifications}
                          left={<TextInput.Icon style={styles.icon} size={22} icon="bell-outline" />}
                        />
                        <View style={styles.controlAlign}>
                          <Switch style={styles.controlSwitch} value={state.pushEnabled} disabled={savingNotifications} />
                        </View>
                        <Pressable style={styles.navPress} onPress={() => setNotifications(!state.pushEnabled)} />
                      </View>
                      <Divider style={styles.navDivider} />
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={state.strings.sealingKey}
                          left={<TextInput.Icon style={styles.icon} size={22} icon="lock" />}
                        />
                        <Pressable style={styles.navPress} onPress={setSeal} />
                      </View>
                      {state.allowUnsealed && <Divider style={styles.navDivider} />}
                      {state.allowUnsealed && (
                        <View style={styles.navUpload}>
                          <TextInput
                            style={styles.navInput}
                            mode="outlined"
                            placeholderTextColor={state.config.sealSet && state.config.sealUnlocked ? undefined : theme.colors.secondary}
                            outlineStyle={styles.navInputBorder}
                            placeholder={state.strings.createSealed}
                            left={<TextInput.Icon style={styles.icon} size={22} icon="sort-variant-lock" />}
                          />
                          <View style={styles.controlAlign}>
                            <Switch
                              style={styles.controlSwitch}
                              value={state.createSealed && state.config.sealSet && state.config.sealUnlocked}
                              disabled={!state.config.sealSet || !state.config.sealUnlocked}
                            />
                          </View>
                          <Pressable
                            style={styles.navPress}
                            onPress={() => {
                              actions.setCreateSealed(!state.createSealed);
                            }}
                          />
                        </View>
                      )}
                    </Surface>
                  </View>
                )}
                {!setupNav && (
                  <Text variant="headlineSmall" style={styles.sectionLabel}>
                    {state.strings.appLanguage}
                  </Text>
                )}
                {!setupNav && (
                  <View style={styles.navWrapper}>
                    <Surface elevation={0} mode="flat" style={styles.navData}>
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navFullInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={state.strings.languageName}
                          right={<TextInput.Icon style={styles.icon} size={22} icon="dots-horizontal-circle-outline" />}
                        />
                        <Pressable style={styles.navPress} onPress={() => setLanguage(true)}>
                          <Menu visible={language} onDismiss={() => setLanguage(false)} anchor={<View style={styles.anchor} />}>
                            {languageOptions}
                          </Menu>
                        </Pressable>
                      </View>
                    </Surface>
                  </View>
                )}
                {!setupNav && (
                  <Text variant="headlineSmall" style={styles.sectionLabel}>
                    {state.strings.format}
                  </Text>
                )}
                {!setupNav && (
                  <View style={styles.navWrapper}>
                    <Surface elevation={0} mode="flat" style={styles.navData}>
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={state.strings.hourLabel}
                          left={<TextInput.Icon style={styles.icon} size={22} icon="clock" />}
                        />
                        <View style={styles.controlAlign}>
                          <View style={styles.radioButtons}>
                            <RadioButton.Item
                              style={styles.radio}
                              rippleColor="transparent"
                              label={state.strings.timeUs}
                              labelStyle={styles.option}
                              mode="android"
                              status={state.fullDayTime ? 'unchecked' : 'checked'}
                            />
                            <RadioButton.Item
                              style={styles.radio}
                              rippleColor="transparent"
                              label={state.strings.timeEu}
                              labelStyle={styles.option}
                              mode="android"
                              status={state.fullDayTime ? 'checked' : 'unchecked'}
                            />
                          </View>
                        </View>
                        <Pressable style={styles.navPress} onPress={() => actions.setFullDayTime(!state.fullDayTime)} />
                      </View>
                      <Divider style={styles.navDivider} />
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={state.strings.dateLabel}
                          left={<TextInput.Icon style={styles.icon} size={22} icon="calendar" />}
                        />
                        <View style={styles.controlAlign}>
                          <View style={styles.radioButtons}>
                            <RadioButton.Item
                              style={styles.radio}
                              rippleColor="transparent"
                              label={state.strings.dateUs}
                              labelStyle={styles.option}
                              mode="android"
                              status={state.monthFirstDate ? 'checked' : 'unchecked'}
                            />
                            <RadioButton.Item
                              style={styles.radio}
                              rippleColor="transparent"
                              label={state.strings.dateEu}
                              labelStyle={styles.option}
                              mode="android"
                              status={state.monthFirstDate ? 'unchecked' : 'checked'}
                            />
                          </View>
                        </View>
                        <Pressable style={styles.navPress} onPress={() => actions.setMonthFirstDate(!state.monthFirstDate)} />
                      </View>
                      <Divider style={styles.navDivider} />
                      <View style={styles.navFont}>
                        <TextInput style={styles.navInput} mode="outlined" outlineStyle={styles.navInputBorder} placeholder={state.strings.fontFormat} />
                        <View style={styles.navPress} />
                      </View>
                      <View style={styles.slider}>
                        <Slider minimumValue={-10} maximumValue={10} minimumTrackTintColor={theme.colors.primary} value={state.fontSize} onSlidingComplete={val => actions.setFontSize(val)} />
                      </View>
                    </Surface>
                  </View>
                )}
                {!setupNav && (
                  <Text variant="headlineSmall" style={styles.sectionLabel}>
                    {state.strings.blocked}
                  </Text>
                )}
                {!setupNav && (
                  <View style={styles.navWrapper}>
                    <Surface elevation={0} mode="flat" style={styles.navData}>
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={state.strings.contacts}
                          left={<TextInput.Icon style={styles.icon} size={22} icon="users" />}
                        />
                        <Pressable style={styles.navPress} onPress={showBlockedContact} />
                      </View>
                      <Divider style={styles.navDivider} />
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={state.strings.topics}
                          left={<TextInput.Icon style={styles.icon} size={22} icon="text-box-outline" />}
                        />
                        <Pressable style={styles.navPress} onPress={showBlockedChannel} />
                      </View>
                      <Divider style={styles.navDivider} />
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={state.strings.messages}
                          left={<TextInput.Icon style={styles.icon} size={22} icon="message-circle" />}
                        />
                        <Pressable style={styles.navPress} onPress={showBlockedMessage} />
                      </View>
                    </Surface>
                  </View>
                )}
                {!setupNav && (
                  <Text variant="headlineSmall" style={styles.sectionLabel}>
                    {state.strings.support}
                  </Text>
                )}
                {!setupNav && (
                  <View style={styles.navWrapper}>
                    <Surface elevation={0} mode="flat" style={styles.navData}>
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder="github.com/balzack/databag"
                          left={<TextInput.Icon style={styles.icon} size={22} icon="github" />}
                        />
                        <Pressable style={styles.navPress} onPress={() => Linking.openURL('https://github.com/balzack/databag')} />
                      </View>
                    </Surface>
                  </View>
                )}
              </SafeAreaView>
            </Surface>
          </KeyboardAwareScrollView>
        </Animated.View>
      </View>
      <Modal animationType="fade" transparent={true} visible={sealing} supportedOrientations={['portrait', 'landscape']} onRequestClose={() => setSealing(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <KeyboardAwareScrollView enableOnAndroid={true} style={styles.container} contentContainerStyle={styles.content}>
            <Surface elevation={4} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.encryptionKey}</Text>
              {sealConfig && !sealDelete && !sealReset && state.config.sealSet && state.config.sealUnlocked && (
                <>
                  <Text style={styles.modalDescription}>{state.strings.saveDelete}</Text>
                  <View style={styles.modalControls}>
                    <Button style={styles.modalControl} mode="contained" onPress={() => setSealReset(true)}>
                      {state.strings.resave}
                    </Button>
                    <Button style={{ ...styles.modalControl, backgroundColor: theme.colors.offsync }} icon="trash-2" mode="contained" loading={savingSeal} onPress={() => setSealDelete(true)}>
                      {state.strings.remove}
                    </Button>
                  </View>
                  <View style={styles.more}>
                    <Button mode="text" onPress={() => setSealConfig(false)}>{ state.strings.moreOptions }</Button>
                  </View>
                </>
              )}
              {!sealConfig && !sealDelete && !sealReset && state.config.sealSet && state.config.sealUnlocked && (
                <>
                  <Text style={styles.modalDescription}>{state.strings.sealForget}</Text>
                    <View style={styles.modalControls}>
                      <Button style={styles.modalControl} mode="outlined" onPress={() => setSealing(false)}>
                        {state.strings.cancel}
                      </Button>
                      <Button style={styles.modalControl} mode="contained" loading={savingSeal} onPress={sealForget}>
                        {state.strings.forget}
                      </Button>
                    </View>
                  <View style={styles.more}>
                    <Button mode="text" onPress={() => setSealConfig(true)}>{ state.strings.moreOptions }</Button>
                  </View>
                </>
              )}
              {!sealDelete && sealReset && state.config.sealSet && state.config.sealUnlocked && (
                <>
                  <Text style={styles.modalDescription}>{state.strings.sealUpdate}</Text>
                 <TextInput
                    style={styles.input}
                    mode="outlined"
                    outlineStyle={styles.inputBorder}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    value={state.sealPassword}
                    placeholder={state.strings.password}
                    secureTextEntry={!showPassword}
                    left={<TextInput.Icon style={styles.icon} icon="lock" />}
                    right={
                      showPassword ? (
                        <TextInput.Icon style={styles.icon} icon="eye-off" onPress={() => setShowPassword(false)} />
                      ) : (
                        <TextInput.Icon style={styles.icon} icon="eye" onPress={() => setShowPassword(true)} />
                      )  
                    }  
                    onChangeText={value => actions.setSealPassword(value)}
                  /> 
                  <View style={styles.modalControls}>
                    <Button style={styles.modalControl} mode="outlined" onPress={() => setSealing(false)}>
                      {state.strings.cancel}
                    </Button>
                    <Button style={styles.modalControl} mode="contained" disabled={!state.sealPassword} loading={savingSeal} onPress={sealUpdate}>
                      {state.strings.save}
                    </Button>
                  </View>
                </>
              )}
              {!sealDelete && state.config.sealSet && !state.config.sealUnlocked && (
                <>
                  <Text style={styles.modalDescription}>{state.strings.sealUnlock}</Text>

                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    outlineStyle={styles.inputBorder}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    value={state.sealPassword}
                    placeholder={state.strings.password}
                    secureTextEntry={!showPassword}
                    left={<TextInput.Icon style={styles.icon} icon="lock" />}
                    onChangeText={value => actions.setSealPassword(value)}
                    right={
                      showPassword ? (
                        <TextInput.Icon style={styles.icon} icon="eye-off" onPress={() => setShowPassword(false)} />
                      ) : (
                        <TextInput.Icon style={styles.icon} icon="eye" onPress={() => setShowPassword(true)} />
                      )
                    }
                  /> 
                    <View style={styles.modalControls}>
                      <Button style={styles.modalControl} mode="outlined" onPress={() => setSealing(false)}>
                        {state.strings.cancel}
                      </Button>
                      <Button style={styles.modalControl} mode="contained" disabled={state.sealPassword.length === 0} loading={savingSeal} onPress={sealUnlock}>
                        {state.strings.unlock}
                      </Button>
                    </View>
                  <View style={styles.more}>
                    <Button mode="text" onPress={() => setSealDelete(true)}>{ state.strings.moreOptions }</Button>
                  </View>
                </>
              )}
              {sealDelete && state.config.sealSet && (
                <>
                  <Text style={styles.modalDescription}>{state.strings.sealDelete}</Text>

                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    outlineStyle={styles.inputBorder}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    value={state.sealDelete} 
                    placeholder={state.strings.typeDelete}
                    onChangeText={value => actions.setSealDelete(value)}
                  />  
                  <View style={styles.modalControls}>
                      <Button style={styles.modalControl} mode="outlined" onPress={() => setSealing(false)}>
                        {state.strings.cancel}
                      </Button>
                    <Button style={{ ...styles.modalControl, backgroundColor: theme.colors.offsync }} mode="contained" icon="trash-2" disabled={state.sealDelete !== state.strings.delete} loading={savingSeal} onPress={sealRemove}>
                      {state.strings.remove}
                    </Button>
                  </View>
                </>
              )}
              {!state.config.sealSet && (
                <>
                  <Text style={styles.modalDescription}>{state.strings.generateKey}</Text>

                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    outlineStyle={styles.inputBorder}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    value={state.sealPassword} 
                    placeholder={state.strings.password}
                    secureTextEntry={!showPassword}
                    left={<TextInput.Icon style={styles.icon} icon="lock" />} 
                    right={
                      showPassword ? ( 
                        <TextInput.Icon style={styles.icon} icon="eye-off" onPress={() => setShowPassword(false)} />
                      ) : ( 
                        <TextInput.Icon style={styles.icon} icon="eye" onPress={() => setShowPassword(true)} />
                      )   
                    }   
                    onChangeText={value => actions.setSealPassword(value)}
                  />  
                  <View style={styles.modalControls}>
                    <Button style={styles.modalControl} mode="outlined" onPress={() => setSealing(false)}>
                      {state.strings.cancel}
                    </Button>
                    <Button style={styles.modalControl} mode="contained" disabled={state.sealPassword.length === 0} loading={savingSeal} onPress={sealCreate}>
                      {state.strings.save}
                    </Button>
                  </View>
                  <Text style={styles.modalWarn}>{state.strings.delayMessage}</Text>
                </>
              )}
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={auth} onRequestClose={() => setAuth(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <KeyboardAwareScrollView enableOnAndroid={true} style={styles.container} contentContainerStyle={styles.content}>
            <Surface elevation={4} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.mfaTitle}</Text>
              <Text style={styles.modalDescription}>{state.strings.mfaSteps}</Text>
              <Image style={styles.secretImage} resizeMode={'contain'} source={{uri: state.secretImage}} />

              <View style={styles.secretText}>
                <Text style={styles.secret} selectable={true} adjustsFontSizeToFit={true} numberOfLines={1}>
                  {state.secretText}
                </Text>
                <TouchableOpacity onPress={copySecret}>
                  <Icon style={styles.secretIcon} size={18} source={secretCopy ? 'check' : 'content-copy'} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <InputCode onChangeText={actions.setCode} />

              <View style={styles.authMessage}>
                <Text style={styles.authMessageText}>{authMessage}</Text>
              </View>

              <View style={styles.modalControls}>
                <Button style={styles.modalControl} mode="outlined" onPress={() => setAuth(false)}>
                  {state.strings.cancel}
                </Button>
                <Button style={styles.modalControl} mode="contained" loading={confirmingAuth} disabled={state.code.length !== 6} onPress={confirmAuth}>
                  {state.strings.mfaConfirm}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={clear} onRequestClose={() => setClear(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <KeyboardAwareScrollView enableOnAndroid={true} style={styles.container} contentContainerStyle={styles.content}>
            <Surface elevation={4} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.mfaTitle}</Text>
              <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setClear(false)} />
              <Text style={styles.modalDescription}>{state.strings.disablePrompt}</Text>

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setClear(false)}>
                  {state.strings.cancel}
                </Button>
                <Button mode="contained" loading={confirmingAuth} onPress={clearAuth}>
                  {state.strings.disable}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={change} onRequestClose={() => setChange(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <KeyboardAwareScrollView enableOnAndroid={true} style={styles.container} contentContainerStyle={styles.content}>
            <Surface elevation={4} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.changeLogin}</Text>
              <Text style={styles.modalPrompt}>{state.strings.changePrompt}</Text>
              <TextInput
                style={styles.input}
                mode="outlined"
                outlineStyle={styles.inputBorder}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                placeholder={state.strings.username}
                value={state.handle}
                left={<TextInput.Icon style={styles.icon} icon="user" />}
                right={state.taken ? <TextInput.Icon styles={styles.icon} color={theme.colors.offsync} icon="warning" /> : <></>}
                onChangeText={value => actions.setHandle(value)}
              />
              <TextInput
                style={styles.input}
                mode="outlined"
                outlineStyle={styles.inputBorder}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                value={state.password}
                placeholder={state.strings.password}
                secureTextEntry={!showPassword}
                left={<TextInput.Icon style={styles.icon} icon="lock" />}
                right={
                  showPassword ? (
                    <TextInput.Icon style={styles.icon} icon="eye-off" onPress={() => setShowPassword(false)} />
                  ) : (
                    <TextInput.Icon style={styles.icon} icon="eye" onPress={() => setShowPassword(true)} />
                  )
                }
                onChangeText={value => actions.setPassword(value)}
              />
              <View style={styles.modalControls}>
                <Button mode="outlined" style={styles.modalControl} onPress={() => setChange(false)}>
                  {state.strings.cancel}
                </Button>
                <Button mode="contained" style={styles.modalControl} loading={savingChange} disabled={state.password === '' || state.taken || !state.checked} onPress={saveChange}>
                  {state.strings.save}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={logout} onRequestClose={() => setLogout(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <KeyboardAwareScrollView enableOnAndroid={true} style={styles.container} contentContainerStyle={styles.content}>
            <Surface elevation={4} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.sureLogout}</Text>

              <View style={styles.allControl}>
                <Text style={styles.controlLabel}>{state.strings.allDevices}</Text>
                <Switch style={styles.controlSwitch} value={state.all} onValueChange={actions.setAll} />
              </View>

              <Divider style={styles.logoutSpace} />

              <View style={styles.modalControls}>
                <Button mode="outlined" style={styles.modalControl} onPress={() => setLogout(false)}>
                  {state.strings.cancel}
                </Button>
                <Button mode="contained" style={styles.modalControl} loading={applyingLogout} onPress={applyLogout}>
                  {state.strings.logout}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={remove} onRequestClose={() => setRemove(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <KeyboardAwareScrollView enableOnAndroid={true} style={styles.container} contentContainerStyle={styles.content}>
            <Surface elevation={4} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.deleteAccount}</Text>

              <TextInput
                style={styles.input}
                mode="outlined"
                outlineStyle={styles.inputBorder}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                value={state.remove}
                placeholder={state.strings.typeDelete}
                onChangeText={value => actions.setRemove(value)}
              />

              <View style={styles.modalControls}>
                <Button style={styles.modalControl} mode="outlined" onPress={() => setRemove(false)}>
                  {state.strings.cancel}
                </Button>
                <Button style={{ ...styles.modalControl, backgroundColor: theme.colors.offsync }} mode="contained" loading={applyingRemove} icon="trash-2" disabled={state.remove !== state.strings.delete} onPress={applyRemove}>
                  {state.strings.remove}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={blockedMessage} onRequestClose={() => setBlockedMessage(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <View style={styles.blockedContent}>
            <Surface elevation={4} mode="flat" style={styles.blockedSurface}>
              <View style={styles.blockedHeader}>
                <Text style={styles.modalLabel}>{state.strings.blockedMessages}</Text>
              </View>
              <Surface style={styles.blocked} elevation={1} mode="flat">
                {state.blockedMessages.length === 0 && (
                  <View style={styles.blockedEmpty}>
                    <Text style={styles.blockedLabel}>{state.strings.noMessages}</Text>
                  </View>
                )}
                {state.blockedMessages.length > 0 && <View>{blockedMessages}</View>}
              </Surface>
              <View style={styles.blockedDone}>
                {blockedError && <Text style={styles.blockedError}>{state.strings.operationFailed}</Text>}
                <Button style={styles.blockedButton} mode="outlined" onPress={() => setBlockedMessage(false)}>
                  {state.strings.close}
                </Button>
              </View>
            </Surface>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={blockedChannel} onRequestClose={() => setBlockedChannel(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <View style={styles.blockedContent}>
            <Surface elevation={4} mode="flat" style={styles.blockedSurface}>
              <View style={styles.blockedHeader}>
                <Text style={styles.modalLabel}>{state.strings.blockedTopics}</Text>
              </View>
              <Surface style={styles.blocked} elevation={1} mode="flat">
                {state.blockedChannels.length === 0 && (
                  <View style={styles.blockedEmpty}>
                    <Text style={styles.blockedLabel}>{state.strings.noTopics}</Text>
                  </View>
                )}
                {state.blockedChannels.length > 0 && <View>{blockedChannels}</View>}
              </Surface>
              <View style={styles.blockedDone}>
                {blockedError && <Text style={styles.blockedError}>{state.strings.operationFailed}</Text>}
                <Button style={styles.blockedButton} mode="outlined" onPress={() => setBlockedChannel(false)}>
                  {state.strings.close}
                </Button>
              </View>
            </Surface>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={blockedContact} onRequestClose={() => setBlockedContact(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <View style={styles.blockedContent}>
            <Surface elevation={4} mode="flat" style={styles.blockedSurface}>
              <View style={styles.blockedHeader}>
                <Text style={styles.modalLabel}>{state.strings.blockedContacts}</Text>
              </View>
              <Surface style={styles.blocked} elevation={1} mode="flat">
                {state.blockedContacts.length === 0 && (
                  <View style={styles.blockedEmpty}>
                    <Text style={styles.blockedLabel}>{state.strings.noContacts}</Text>
                  </View>
                )}
                {state.blockedContacts.length > 0 && <View>{blockedContacts}</View>}
              </Surface>
              <View style={styles.blockedDone}>
                {blockedError && <Text style={styles.blockedError}>{state.strings.operationFailed}</Text>}
                <Button style={styles.blockedButton} mode="outlined" onPress={() => setBlockedContact(false)}>
                  {state.strings.close}
                </Button>
              </View>
            </Surface>
          </View>
        </View>
      </Modal>
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}
