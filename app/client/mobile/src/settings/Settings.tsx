import React, {useState, useRef} from 'react';
import {useTheme, Surface, Menu, Button, Text, IconButton, Divider, Icon, TextInput, RadioButton, Switch} from 'react-native-paper';
import {TouchableOpacity, Pressable, Modal, View, Image, ScrollView, Platform, Linking} from 'react-native';
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

export function Settings({setupNav, showLogout}: {setupNav: { back: ()=>void, next: ()=>void }, showLogout: boolean}) {
  const {state, actions} = useSettings();
  const [alert, setAlert] = useState(false);
  const [details, setDetails] = useState(false);
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
    cancel: {
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

  const languageOptions = languages.map(item => <Menu.Item key={item.value} onPress={() => { setLanguage(false); actions.setLanguage(item.value)}} trailingIcon={item.value === state.strings.code ? 'check' : undefined} title={item.name} />)

  return (
    <View>
      { state.layout === 'small' && (
        <View style={styles.settings}>
          {setupNav && (
          <Surface elevation={9} mode="flat" style={styles.navHeader}>
            <Pressable style={styles.navIcon} onPress={setupNav?.back}>
              <Icon size={24} source="left" color={'white'} />
            </Pressable>
            <Text variant="headlineSmall" style={styles.navTitle}>{ state.strings.yourProfile }</Text>
            <View style={styles.navIcon} />
          </Surface>
          )}
          {!setupNav && (
            <Surface mode="flat" elevation={9} style={styles.navHeader}>
              <Text variant="headlineSmall" style={styles.navTitle}>{ state.strings.settings }</Text>
            </Surface>
          )}
          <View style={styles.navImage}>
            <Image style={styles.navLogo} resizeMode={'contain'} source={{uri: state.imageUrl}} />
            <Surface style={styles.overlap} elevation={2} mode="flat" />
          </View>
          <View style={styles.scrollWrapper}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
              <View style={styles.imageSpacer} />
              <Surface mode="flat" elevation={2} style={styles.navForm}>
                {!setupNav && (
                  <Text variant="headlineSmall" style={styles.sectionLabel}>{ state.strings.profile }</Text>
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
                        value={`${state.profile.handle}${state.profile.node ? '/' + state.profile.node : ''}`}
                        left={<TextInput.Icon style={styles.icon} iconColor={theme.colors.tertiary} size={22} icon="user" />}
                      />
                    )}
                    {!setupNav && (
                      <Divider style={styles.navDivider} />
                    )}
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
                  <Text variant="headlineSmall" style={styles.sectionLabel}>{ state.strings.account }</Text>
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
                        <Pressable style={styles.navPress} onPress={()=>setMfa(!state.mfaEnabled)} />
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
                        <Pressable style={styles.navPress} onPress={()=>setLogout(true)} />
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
                        <Pressable style={styles.navPress} onPress={()=>setRemove(true)} />
                      </View>
                    </Surface>
                  </View>
                )}
                {!setupNav && (
                  <Text variant="headlineSmall" style={styles.sectionLabel}>{ state.strings.messaging }</Text>
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
                        <Pressable style={styles.navPress} onPress={()=>setNotifications(!state.pushEnabled)} />
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
                      { state.allowUnsealed && (
                        <Divider style={styles.navDivider} />
                      )}
                      { state.allowUnsealed && (
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
                            <Switch style={styles.controlSwitch} value={state.createSealed && state.config.sealSet && state.config.sealUnlocked} disabled={!state.config.sealSet || !state.config.sealUnlocked} />
                          </View>
                          <Pressable style={styles.navPress} onPress={()=>{actions.setCreateSealed(!state.createSealed)}} />
                        </View>
                      )}
                    </Surface>
                  </View>
                )}
                {!setupNav && (
                  <Text variant="headlineSmall" style={styles.sectionLabel}>{ state.strings.appLanguage }</Text>
                )}
                {!setupNav && (
                  <View style={styles.navWrapper}>
                    <Surface elevation={0} mode="flat" style={styles.navData}>
                      <View style={styles.navUpload}>
                        <TextInput
                          style={styles.navFullInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={ state.strings.languageName }
                          right={<TextInput.Icon style={styles.icon} size={22} icon="dots-horizontal-circle-outline" />}
                        />
                        <Pressable style={styles.navPress} onPress={()=>setLanguage(true)}>
                          <Menu
                            visible={language}
                            onDismiss={()=>setLanguage(false)}
                            anchor={<View style={styles.anchor} />}>
                            { languageOptions }
                          </Menu>
                        </Pressable>
                      </View>
                    </Surface>
                  </View>
                )}
                {!setupNav && (
                  <Text variant="headlineSmall" style={styles.sectionLabel}>{ state.strings.format }</Text>
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
                        <Pressable style={styles.navPress} onPress={()=>actions.setFullDayTime(!state.fullDayTime)} />
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
                        <Pressable style={styles.navPress} onPress={()=>actions.setMonthFirstDate(!state.monthFirstDate)} />
                      </View>
                      <Divider style={styles.navDivider} />
                      <View style={styles.navFont}>
                        <TextInput
                          style={styles.navInput}
                          mode="outlined"
                          outlineStyle={styles.navInputBorder}
                          placeholder={state.strings.fontFormat}
                        />
                        <View style={styles.navPress} />
                      </View>
                      <View style={styles.slider}>
                        <Slider
                          minimumValue={-10}
                          maximumValue={10}
                          minimumTrackTintColor={theme.colors.primary}
                          value={state.fontSize}
                          onSlidingComplete={(val)=>actions.setFontSize(val)}
                        />
                      </View>
                    </Surface>

                  </View>
                )}
                {!setupNav && (
                  <Text variant="headlineSmall" style={styles.sectionLabel}>{ state.strings.blocked }</Text>
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
                  <Text variant="headlineSmall" style={styles.sectionLabel}>{ state.strings.support }</Text>
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
                        <Pressable style={styles.navPress} onPress={()=>Linking.openURL('https://github.com/balzack/databag')} />
                      </View>
                    </Surface>
                  </View>
                )}
              </Surface>
            </KeyboardAwareScrollView>
          </View>
        </View>
      )}
      { state.layout === 'large' && (
        <View style={styles.settings}>
          <View style={styles.title}>
            <Text style={styles.header} adjustsFontSizeToFit={true} numberOfLines={1}>{`${state.profile.handle}${state.profile.node ? '@' + state.profile.node : ''}`}</Text>
            <Divider style={styles.border} bold={true} />
          </View>
          <View style={styles.scrollWrapper}>
            <KeyboardAwareScrollView enableOnAndroid={true} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
              <View style={styles.image}>
                {!state.profile.imageSet && <Image style={styles.logoUnset} resizeMode={'contain'} source={{uri: state.imageUrl}} />}
                {state.profile.imageSet && <Image style={styles.logoSet} resizeMode={'contain'} source={{uri: state.imageUrl}} />}
                <View style={styles.editBar}>
                  <TouchableOpacity onPress={selectImage}>
                    <Surface style={styles.editBorder} elevation={0} mode="flat">
                      <Text style={styles.editLogo}>{state.strings.edit}</Text>
                    </Surface>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider}>
                <Divider style={styles.line} bold={true} />
              </View>

              <View style={styles.attributes}>
                {!state.profile.name && <Text style={styles.nameUnset}>{state.strings.name}</Text>}
                {state.profile.name && (
                  <Text style={styles.nameSet} adjustsFontSizeToFit={true} numberOfLines={1}>
                    {state.profile.name}
                  </Text>
                )}
                <View style={styles.attribute}>
                  <View style={styles.icon}>
                    <Icon size={24} source="map-marker-outline" />
                  </View>
                  {!state.profile.location && <Text style={styles.labelUnset}>{state.strings.location}</Text>}
                  {state.profile.location && <Text style={styles.labelSet}>{state.profile.location}</Text>}
                </View>
                <View style={styles.attribute}>
                  <View style={styles.icon}>
                    <Icon size={24} source="book-open-outline" />
                  </View>
                  {!state.profile.description && <Text style={styles.labelUnset}>{state.strings.description}</Text>}
                  {state.profile.description && <Text style={styles.labelSet}>{state.profile.description}</Text>}
                </View>
                <TouchableOpacity style={styles.editDetails} onPress={() => setDetails(true)}>
                  <Text style={styles.editDetailsLabel}>{state.strings.edit}</Text>
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
                      <Text style={styles.controlLabel}>{state.strings.registry}</Text>
                    </TouchableOpacity>
                    <Switch style={styles.controlSwitch} value={state.config.searchable} onValueChange={setRegistry} />
                  </View>
                </View>
                <View style={styles.attribute}>
                  <View style={styles.controlIcon}>
                    <Icon size={24} source="cloud-lock-outline" />
                  </View>
                  <View style={styles.control}>
                    <TouchableOpacity activeOpacity={1} onPress={setSeal}>
                      <Text style={styles.controlLabel}>{state.strings.manageTopics}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.attribute}>
                  <View style={styles.controlIcon}>
                    <Icon size={24} source="bell-outline" />
                  </View>
                  <View style={styles.control}>
                    <TouchableOpacity activeOpacity={1} onPress={() => setNotifications(!state.config.pushEnabled)}>
                      <Text style={styles.controlLabel}>{state.strings.enableNotifications}</Text>
                    </TouchableOpacity>
                    <Switch style={styles.controlSwitch} value={state.config.pushEnabled} onValueChange={setNotifications} />
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
                    <TouchableOpacity activeOpacity={1} onPress={() => setMfa(!state.config.mfaEnabled)}>
                      <Text style={styles.controlLabel}>{state.strings.mfaTitle}</Text>
                    </TouchableOpacity>
                    <Switch style={styles.controlSwitch} value={state.config.mfaEnabled} onValueChange={setMfa} />
                  </View>
                </View>
                <View style={styles.attribute}>
                  <View style={styles.controlIcon}>
                    <Icon size={24} source="login" />
                  </View>
                  <View style={styles.control}>
                    <TouchableOpacity activeOpacity={1} onPress={changeLogin}>
                      <Text style={styles.controlLabel}>{state.strings.changeLogin}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {showLogout && (
                  <View style={styles.attribute}>
                    <View style={styles.controlIcon}>
                      <Icon size={24} source="logout" />
                    </View>
                    <View style={styles.control}>
                      <TouchableOpacity activeOpacity={1} onPress={() => setLogout(true)}>
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
                    <TouchableOpacity activeOpacity={1} onPress={() => setRemove(true)}>
                      <Text style={styles.dangerLabel}>{state.strings.deleteAccount}</Text>
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
                    <TouchableOpacity activeOpacity={1} onPress={showBlockedContact}>
                      <Text style={styles.controlLabel}>{state.strings.blockedContacts}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.attribute}>
                  <View style={styles.controlIcon}>
                    <Icon size={24} source="archive-cancel-outline" />
                  </View>
                  <View style={styles.control}>
                    <TouchableOpacity activeOpacity={1} onPress={showBlockedChannel}>
                      <Text style={styles.controlLabel}>{state.strings.blockedTopics}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.attribute}>
                  <View style={styles.controlIcon}>
                    <Icon size={24} source="file-cancel-outline" />
                  </View>
                  <View style={styles.control}>
                    <TouchableOpacity activeOpacity={1} onPress={showBlockedMessage}>
                      <Text style={styles.controlLabel}>{state.strings.blockedMessages}</Text>
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
                    <Text style={styles.smallLabel}>{state.strings.timeFormat}:</Text>
                    <View style={styles.radioButtons}>
                      <RadioButton.Item
                        style={styles.radio}
                        rippleColor="transparent"
                        label={state.strings.timeUs}
                        labelStyle={styles.option}
                        mode="android"
                        status={state.fullDayTime ? 'unchecked' : 'checked'}
                        onPress={() => {
                          actions.setFullDayTime(false);
                        }}
                      />
                      <RadioButton.Item
                        style={styles.radio}
                        rippleColor="transparent"
                        label={state.strings.timeEu}
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
                    <Text style={styles.smallLabel}>{state.strings.dateFormat}:</Text>
                    <View style={styles.radioButtons}>
                      <RadioButton.Item
                        style={styles.radio}
                        rippleColor="transparent"
                        label={state.strings.dateUs}
                        labelStyle={styles.option}
                        mode="android"
                        status={state.monthFirstDate ? 'checked' : 'unchecked'}
                        onPress={() => {
                          actions.setMonthFirstDate(true);
                        }}
                      />
                      <RadioButton.Item
                        style={styles.radio}
                        rippleColor="transparent"
                        label={state.strings.dateEu}
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
            </KeyboardAwareScrollView>
          </View>
        </View>
      )}
      <Modal animationType="fade" transparent={true} visible={sealing} supportedOrientations={['portrait', 'landscape']} onRequestClose={() => setSealing(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <KeyboardAwareScrollView enableOnAndroid={true} style={styles.container} contentContainerStyle={styles.content}>
            <Surface elevation={4} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.manageTopics}</Text>
              <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setSealing(false)} />
              {!sealDelete && !sealReset && state.config.sealSet && state.config.sealUnlocked && (
                <>
                  <Text style={styles.modalDescription}>{state.strings.sealForget}</Text>
                  {!sealConfig && (
                    <View style={styles.modalControls}>
                      <View style={styles.modalOption}>
                        <IconButton
                          style={styles.optionIcon}
                          iconColor={Colors.primary}
                          icon="menu-right-outline"
                          size={32}
                          onPress={() => {
                            setSealConfig(true);
                          }}
                        />
                      </View>
                      <Button mode="outlined" onPress={() => setSealing(false)}>
                        {state.strings.cancel}
                      </Button>
                      <Button mode="contained" loading={savingSeal} onPress={sealForget}>
                        {state.strings.forget}
                      </Button>
                    </View>
                  )}
                  {sealConfig && (
                    <View style={styles.modalControls}>
                      <Button mode="contained" onPress={() => setSealReset(true)}>
                        {state.strings.resave}
                      </Button>
                      <Button mode="contained" style={styles.deleteButton} loading={savingSeal} onPress={() => setSealDelete(true)}>
                        {state.strings.remove}
                      </Button>
                      <View style={styles.modalOther}>
                        <IconButton
                          style={styles.optionIcon}
                          iconColor={Colors.primary}
                          icon="menu-left-outline"
                          size={32}
                          onPress={() => {
                            setSealConfig(false);
                          }}
                        />
                      </View>
                    </View>
                  )}
                </>
              )}
              {!sealDelete && sealReset && state.config.sealSet && state.config.sealUnlocked && (
                <>
                  <Text style={styles.modalDescription}>{state.strings.sealUpdate}</Text>
                  <TextInput
                    style={styles.input}
                    mode="flat"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    value={state.sealPassword}
                    label={Platform.OS === 'ios' ? state.strings.password : undefined}
                    placeholder={Platform.OS !== 'ios' ? state.strings.password : undefined}
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
                  <TextInput
                    style={styles.input}
                    mode="flat"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    value={state.sealConfirm}
                    label={Platform.OS === 'ios' ? state.strings.confirmPassword : undefined}
                    placeholder={Platform.OS !== 'ios' ? state.strings.confirmPassword : undefined}
                    secureTextEntry={!showConfirm}
                    left={<TextInput.Icon style={styles.icon} icon="lock" />}
                    right={
                      showPassword ? (
                        <TextInput.Icon style={styles.icon} icon="eye-off" onPress={() => setShowConfirm(false)} />
                      ) : (
                        <TextInput.Icon style={styles.icon} icon="eye" onPress={() => setShowConfirm(true)} />
                      )
                    }
                    onChangeText={value => actions.setSealConfirm(value)}
                  />
                  <View style={styles.modalControls}>
                    <Button mode="outlined" onPress={() => setSealing(false)}>
                      {state.strings.cancel}
                    </Button>
                    <Button mode="contained" disabled={state.sealPassword.length === 0 || state.sealConfirm !== state.sealPassword} loading={savingSeal} onPress={sealUpdate}>
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
                    mode="flat"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    value={state.sealPassword}
                    label={Platform.OS === 'ios' ? state.strings.password : undefined}
                    placeholder={Platform.OS !== 'ios' ? state.strings.password : undefined}
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
                  {!sealConfig && (
                    <View style={styles.modalControls}>
                      <View style={styles.modalOption}>
                        <IconButton
                          style={styles.optionIcon}
                          iconColor={Colors.primary}
                          icon="menu-right-outline"
                          size={32}
                          onPress={() => {
                            setSealConfig(true);
                          }}
                        />
                      </View>
                      <Button mode="outlined" onPress={() => setSealing(false)}>
                        {state.strings.cancel}
                      </Button>
                      <Button mode="contained" disabled={state.sealPassword.length === 0} loading={savingSeal} onPress={sealUnlock}>
                        {state.strings.unlock}
                      </Button>
                    </View>
                  )}
                  {sealConfig && (
                    <View style={styles.modalControls}>
                      <Button mode="contained" style={styles.deleteButton} loading={savingSeal} onPress={() => setSealDelete(true)}>
                        {state.strings.delete}
                      </Button>
                      <View style={styles.modalOther}>
                        <IconButton
                          style={styles.optionIcon}
                          iconColor={Colors.primary}
                          icon="menu-left-outline"
                          size={32}
                          onPress={() => {
                            setSealConfig(false);
                          }}
                        />
                      </View>
                    </View>
                  )}
                </>
              )}
              {sealDelete && state.config.sealSet && (
                <>
                  <Text style={styles.modalDescription}>{state.strings.sealDelete}</Text>
                  <TextInput
                    style={styles.input}
                    mode="flat"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    value={state.sealDelete}
                    label={Platform.OS === 'ios' ? state.strings.deleteKey : undefined}
                    placeholder={Platform.OS !== 'ios' ? state.strings.deleteKey : undefined}
                    left={<TextInput.Icon style={styles.icon} icon="lock" />}
                    onChangeText={value => actions.setSealDelete(value)}
                  />
                  <View style={styles.modalControls}>
                    <Button mode="contained" style={styles.deleteButton} disabled={state.sealDelete !== state.strings.deleteKey} loading={savingSeal} onPress={sealRemove}>
                      {state.strings.delete}
                    </Button>
                  </View>
                </>
              )}
              {!state.config.sealSet && (
                <>
                  <Text style={styles.modalDescription}>{state.strings.sealCreate}</Text>
                  <Text style={styles.modalDescription}>{state.strings.delayMessage}</Text>
                  <TextInput
                    style={styles.input}
                    mode="flat"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    value={state.sealPassword}
                    label={Platform.OS === 'ios' ? state.strings.password : undefined}
                    placeholder={Platform.OS !== 'ios' ? state.strings.password : undefined}
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
                    <Button mode="outlined" onPress={() => setSealing(false)}>
                      {state.strings.cancel}
                    </Button>
                    <Button mode="contained" disabled={state.sealPassword.length === 0} loading={savingSeal} onPress={sealCreate}>
                      {state.strings.save}
                    </Button>
                  </View>
                </>
              )}
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={details} onRequestClose={() => setDetails(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <KeyboardAwareScrollView enableOnAndroid={true} style={styles.container} contentContainerStyle={styles.content}>
            <Surface elevation={4} mode="flat" style={styles.surface}>
              <Text style={styles.modalLabel}>{state.strings.profileDetails}</Text>
              <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setDetails(false)} />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={Platform.OS === 'ios' ? state.strings.name : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.name : undefined}
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
                label={Platform.OS === 'ios' ? state.strings.location : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.location : undefined}
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
                label={Platform.OS === 'ios' ? state.strings.description : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.description : undefined}
                value={state.description}
                left={<TextInput.Icon style={styles.inputIcon} icon="book-open-outline" />}
                onChangeText={value => actions.setDescription(value)}
              />

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setDetails(false)}>
                  {state.strings.cancel}
                </Button>
                <Button mode="contained" loading={savingDetails} onPress={saveDetails}>
                  {state.strings.save}
                </Button>
              </View>
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
              <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setAuth(false)} />
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
                <Button mode="outlined" onPress={() => setAuth(false)}>
                  {state.strings.cancel}
                </Button>
                <Button mode="contained" loading={confirmingAuth} disabled={state.code.length !== 6} onPress={confirmAuth}>
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
              <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setChange(false)} />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={Platform.OS === 'ios' ? state.strings.username : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.username : undefined}
                value={state.handle}
                left={<TextInput.Icon style={styles.inputIcon} icon="account" />}
                right={
                  !state.checked ? (
                    <TextInput.Icon style={styles.icon} icon="refresh" />
                  ) : state.taken ? (
                    <TextInput.Icon style={styles.icon} color={Colors.danger} icon="account-cancel-outline" />
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
                label={Platform.OS === 'ios' ? state.strings.password : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.password : undefined}
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
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                value={state.confirm}
                label={Platform.OS === 'ios' ? state.strings.confirmPassword : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.confirmPassword : undefined}
                secureTextEntry={!showConfirm}
                left={<TextInput.Icon style={styles.icon} icon="lock" />}
                right={
                  showPassword ? (
                    <TextInput.Icon style={styles.icon} icon="eye-off" onPress={() => setShowConfirm(false)} />
                  ) : (
                    <TextInput.Icon style={styles.icon} icon="eye" onPress={() => setShowConfirm(true)} />
                  )
                }
                onChangeText={value => actions.setConfirm(value)}
              />

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setChange(false)}>
                  {state.strings.cancel}
                </Button>
                <Button mode="contained" loading={savingChange} disabled={state.password === '' || state.password !== state.confirm || state.taken || !state.checked} onPress={saveChange}>
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
              <Text style={styles.modalLabel}>{state.strings.loggingOut}</Text>
              <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setLogout(false)} />

              <View style={styles.allControl}>
                <Text style={styles.controlLabel}>{state.strings.allDevices}</Text>
                <Switch style={styles.controlSwitch} value={state.all} onValueChange={actions.setAll} />
              </View>

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setLogout(false)}>
                  {state.strings.cancel}
                </Button>
                <Button mode="contained" loading={applyingLogout} onPress={applyLogout}>
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
              <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setRemove(false)} />

              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                value={state.remove}
                label={Platform.OS === 'ios' ? state.strings.deleteKey : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.deleteKey : undefined}
                left={<TextInput.Icon style={styles.icon} icon="delete-outline" />}
                onChangeText={value => actions.setRemove(value)}
              />

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={() => setRemove(false)}>
                  {state.strings.cancel}
                </Button>
                <Button mode="contained" loading={applyingRemove} disabled={state.remove !== state.strings.delete} style={styles.remove} onPress={applyRemove}>
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
                <Text style={styles.blockedTitle}>{state.strings.blockedMessages}</Text>
                <IconButton style={styles.blockedClose} icon="close" size={24} onPress={() => setBlockedMessage(false)} />
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
                <Text style={styles.blockedTitle}>{state.strings.blockedTopics}</Text>
                <IconButton style={styles.blockedClose} icon="close" size={24} onPress={() => setBlockedChannel(false)} />
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
                <Text style={styles.blockedTitle}>{state.strings.blockedContacts}</Text>
                <IconButton style={styles.blockedClose} icon="close" size={24} onPress={() => setBlockedContact(false)} />
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
