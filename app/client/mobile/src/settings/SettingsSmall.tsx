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
import {SafeAreaView} from 'react-native-safe-area-context';

export function SettingsSmall({setupNav, showLogout}: {setupNav: { back: ()=>void, next: ()=>void }, showLogout: boolean}) {
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
      <Text style={styles.blockedValue}>{blocked.subject}</Text>
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
      await actions.unblockContact(blocked.cardId);
    } catch (err) {
      console.log(err);
      setBlockedError(true);
    }
  };

  const blockedContacts = state.blockedContacts.map((blocked, index) => (
    <View key={index} style={{...styles.blockedItem, borderColor: theme.colors.outlineVariant}}>
      <Text style={styles.blockedValue}>{blocked.handle ? `${blocked.handle}@${blocked.node}` : state.strings.name}</Text>
      <IconButton style={styles.blockedAction} icon="restore" size={16} onPress={() => unblockContact(blocked)} />
    </View>
  ));

  const selectImage = () => {
    ImagePicker.openPicker({
      width: 256,
      height: 256,
      cropping: true,
      mediaType: 'photo',
    }).then((response) => {
      actions.setImageUrl(response.path);
    }).catch((err) => {
      console.log(err);
    });
  };

  const saveDetails = async () => {
    if (!savingDetails) {
      setSavingDetails(true);
      try {
        await actions.saveProfile();
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSavingDetails(false);
    }
  };

  const setSeal = () => {
    setSealing(true);
  };

  const changeLogin = async () => {
    setChange(true);
  };

  const changePassword = async () => {
    if (!savingChange) {
      setSavingChange(true);
      try {
        await actions.changePassword();
        setChange(false);
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSavingChange(false);
    }
  };

  const setMfa = async (enabled: boolean) => {
    if (!savingAuth && !confirmingAuth) {
      if (enabled) {
        setSavingAuth(true);
        try {
          await actions.enableMfa();
          setAuth(true);
        } catch (err) {
          console.log(err);
          setAlert(true);
        }
        setSavingAuth(false);
      } else {
        setConfirmingAuth(true);
        setAuth(true);
      }
    }
  };

  const confirmMfa = async () => {
    if (!savingAuth) {
      setSavingAuth(true);
      try {
        await actions.confirmMfa();
        setAuth(false);
        setConfirmingAuth(false);
      } catch (err) {
        console.log(err);
        setAuthMessage(state.strings.invalidCode);
      }
      setSavingAuth(false);
    }
  };

  const disableMfa = async () => {
    if (!savingAuth) {
      setSavingAuth(true);
      try {
        await actions.disableMfa();
        setAuth(false);
        setConfirmingAuth(false);
        setAuthMessage('');
      } catch (err) {
        console.log(err);
        setAuthMessage(state.strings.invalidCode);
      }
      setSavingAuth(false);
    }
  };

  const setSealingKey = async () => {
    if (!savingSeal) {
      setSavingSeal(true);
      try {
        await actions.setSealingKey();
        setSealing(false);
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSavingSeal(false);
    }
  };

  const clearSealingKey = async () => {
    setSealDelete(true);
  };

  const deleteSealingKey = async () => {
    if (!savingSeal) {
      setSavingSeal(true);
      try {
        await actions.clearSealingKey();
        setSealing(false);
        setSealDelete(false);
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSavingSeal(false);
    }
  };

  const resetSealingKey = async () => {
    setSealReset(true);
  };

  const newSealingKey = async () => {
    if (!savingSeal) {
      setSavingSeal(true);
      try {
        await actions.resetSealingKey();
        setSealing(false);
        setSealReset(false);
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSavingSeal(false);
    }
  };

  const setRegistry = async (enabled: boolean) => {
    if (!savingRegistry) {
      setSavingRegistry(true);
      try {
        await actions.setRegistry(enabled);
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSavingRegistry(false);
    }
  };

  const setNotifications = async (enabled: boolean) => {
    if (!savingNotifications) {
      setSavingNotifications(true);
      try {
        await actions.setNotifications(enabled);
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
            <Surface mode="flat" elevation={2} style={styles.surfaceMaxWidth}>
              <SafeAreaView style={styles.navForm} edges={['left', 'right']}>
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
              </SafeAreaView>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  );
}