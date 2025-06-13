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

export function SettingsLarge({setupNav, showLogout}: {setupNav: { back: ()=>void, next: ()=>void }, showLogout: boolean}) {
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
    </View>
  );
}