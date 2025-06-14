import React, {useState} from 'react';
import {TouchableOpacity, Modal, Image, View, Pressable} from 'react-native';
import {useTheme, Icon, Button, IconButton, Switch, Surface, Divider, TextInput, Text} from 'react-native-paper';
import {styles} from './Setup.styled';
import {useSetup} from './useSetup.hook';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Confirm} from '../confirm/Confirm';
import {Colors} from '../constants/Colors';
import {InputCode} from '../utils/InputCode';
import {BlurView} from '@react-native-community/blur';
import Clipboard from '@react-native-clipboard/clipboard';
import {SafeAreaView} from 'react-native-safe-area-context';

export function SetupSmall() {
  const {state, actions} = useSetup();
  const [updating, setUpdating] = useState(false);
  const [secretCopy, setSecretCopy] = useState(false);
  const [confirmingAuth, setConfirmingAuth] = useState(false);
  const theme = useTheme();

  const errorParams = {
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    cancel: {
      label: state.strings.close,
      action: actions.clearError,
    },
  };

  const confirmAuth = async () => {
    if (!confirmingAuth) {
      setConfirmingAuth(true);
      await actions.confirmMFAuth();
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

  const toggleMFAuth = async () => {
    if (!updating) {
      setUpdating(true);
      if (state.mfaEnabled) {
        await actions.disableMFAuth();
      } else {
        await actions.enableMFAuth();
      }
      setUpdating(false);
    }
  };

  return (
    <View style={styles.fullContainer}>
      <Surface elevation={1} mode="flat" style={styles.fullContainer}>
        <Surface elevation={9} mode="flat">
          <SafeAreaView edges={['top']}>
            <View style={styles.headerContainer}>
              <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.headerText}>
                {state.strings.adminSettings}
              </Text>
            </View>
          </SafeAreaView>
        </Surface>
        <View style={styles.scrollWrapper}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <Surface mode="flat" elevation={2} style={styles.navForm}>
              <Text variant="headlineSmall" style={styles.sectionLabel}>
                {state.strings.logout}
              </Text>
              <View style={styles.navWrapper}>
                <Surface elevation={0} mode="flat" style={styles.navData}>
                  <View>
                    <TextInput
                      style={styles.navInput}
                      mode="outlined"
                      outlineStyle={styles.navInputBorder}
                      placeholder={state.strings.logout}
                      left={<TextInput.Icon style={styles.icon} size={22} icon="logout" />}
                    />
                    <Pressable style={styles.absoluteOverlay} onPress={actions.logout} />
                  </View>
                </Surface>
              </View>
              <Text variant="headlineSmall" style={styles.sectionLabel}>
                {state.strings.access}
              </Text>
              <View style={styles.navWrapper}>
                <Surface elevation={0} mode="flat" style={styles.navData}>
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>{state.strings.accountKeyType}</Text>
                    <View style={styles.selectOptions}>
                      <Pressable style={styles.selectOption} onPress={() => actions.setKeyType('RSA2048')}>
                        <View
                          style={
                            state.setup?.keyType === 'RSA2048'
                              ? {...styles.radioSelected, backgroundColor: theme.colors.primary, borderColor: theme.colors.primary}
                              : {...styles.radioUnselected, borderColor: theme.colors.primary}
                          }
                        />
                        <Text style={styles.selectLabel}>RSA2048</Text>
                      </Pressable>
                      <Pressable style={styles.selectOption} onPress={() => actions.setKeyType('RSA4096')}>
                        <View
                          style={
                            state.setup?.keyType === 'RSA4096'
                              ? {...styles.radioSelected, backgroundColor: theme.colors.primary, borderColor: theme.colors.primary}
                              : {...styles.radioUnselected, borderColor: theme.colors.primary}
                          }
                        />
                        <Text style={styles.selectLabel}>RSA4094</Text>
                      </Pressable>
                    </View>
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>{state.strings.federatedHost}</Text>
                    <TextInput
                      style={styles.fieldInput}
                      mode="outlined"
                      outlineStyle={{borderColor: theme.colors.primary}}
                      autoCapitalize={false}
                      disabled={state.loading}
                      placeholder={state.strings.hostHint}
                      placeholderTextColor={Colors.placeholder}
                      value={state.setup?.domain}
                      onChangeText={value => actions.setDomain(value)}
                    />
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>{state.strings.storageLimit}</Text>
                    <TextInput
                      style={styles.fieldInput}
                      mode="outlined"
                      outlineStyle={{borderColor: theme.colors.primary}}
                      autoCapitalize={false}
                      disabled={state.loading}
                      placeholder={state.strings.storageHint}
                      placeholderTextColor={Colors.placeholder}
                      value={state.accountStorage}
                      onChangeText={value => actions.setAccountStorage(value)}
                    />
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <View style={styles.fieldData}>
                      <Text style={styles.fieldLabel}>{state.strings.accountCreation}</Text>
                      <Switch
                        style={styles.fieldSwitch}
                        value={state.setup?.enableOpenAccess}
                        disabled={state.loading}
                        onValueChange={() => actions.setEnableOpenAccess(!state.setup?.enableOpenAccess)}
                      />
                    </View>
                    <TextInput
                      type="number"
                      style={styles.fieldInput}
                      outlineStyle={{borderColor: theme.colors.primary}}
                      keyboardType="numeric"
                      autoCapitalize={false}
                      mode="outlined"
                      disabled={!state.setup?.enableOpenAccess}
                      placeholder={state.strings.storageHint}
                      value={state.openAccessLimit}
                      onChangeText={value => actions.setOpenAccessLimit(value)}
                    />
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <View style={styles.fieldData}>
                      <Text style={styles.fieldLabel}>{state.strings.enableNotifications}</Text>
                      <Switch style={styles.fieldSwitch} value={state.setup?.pushSupported} disabled={state.loading} onValueChange={() => actions.setPushSupported(!state.setup?.pushSupported)} />
                    </View>
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <View style={styles.fieldData}>
                      <Text style={styles.fieldLabel}>{state.strings.allowUnsealed}</Text>
                      <Switch style={styles.fieldSwitch} value={state.setup?.allowUnsealed} disabled={state.loading} onValueChange={() => actions.setAllowUnsealed(!state.setup?.allowUnsealed)} />
                    </View>
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <View style={styles.fieldData}>
                      <Text style={styles.fieldLabel}>{state.strings.mfaTitle}</Text>
                      <Switch style={styles.fieldSwitch} value={state.mfaEnabled} disabled={state.loading} onValueChange={toggleMFAuth} />
                    </View>
                  </View>
                </Surface>
              </View>
              <Text variant="headlineSmall" style={styles.sectionLabel}>
                {state.strings.access}
              </Text>
              <View style={styles.navWrapper}>
                <Surface elevation={0} mode="flat" style={styles.navData}>
                  <View style={styles.field}>
                    <View style={styles.fieldData}>
                      <Text style={styles.fieldLabel}>{state.strings.enableImage}</Text>
                      <Switch style={styles.fieldSwitch} value={state.setup?.enableImage} disabled={state.loading} onValueChange={() => actions.setEnableImage(!state.setup?.enableImage)} />
                    </View>
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <View style={styles.fieldData}>
                      <Text style={styles.fieldLabel}>{state.strings.enableAudio}</Text>
                      <Switch style={styles.fieldSwitch} value={state.setup?.enableAudio} disabled={state.loading} onValueChange={() => actions.setEnableAudio(!state.setup?.enableAudio)} />
                    </View>
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <View style={styles.fieldData}>
                      <Text style={styles.fieldLabel}>{state.strings.enableVideo}</Text>
                      <Switch style={styles.fieldSwitch} value={state.setup?.enableVideo} disabled={state.loading} onValueChange={() => actions.setEnableVideo(!state.setup?.enableVideo)} />
                    </View>
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <View style={styles.fieldData}>
                      <Text style={styles.fieldLabel}>{state.strings.enableBinary}</Text>
                      <Switch style={styles.fieldSwitch} value={state.setup?.enableBinary} disabled={state.loading} onValueChange={() => actions.setEnableBinary(!state.setup?.enableBinary)} />
                    </View>
                  </View>
                </Surface>
              </View>
              <Text variant="headlineSmall" style={styles.sectionLabel}>
                {state.strings.calling}
              </Text>
              <View style={styles.navWrapper}>
                <Surface elevation={0} mode="flat" style={styles.navData}>
                  <View style={styles.field}>
                    <View style={styles.fieldData}>
                      <Text style={styles.fieldLabel}>{state.strings.enableWeb}</Text>
                      <Switch style={styles.fieldSwitch} value={state.setup?.enableIce} disabled={state.loading} onValueChange={() => actions.setEnableIce(!state.setup?.enableIce)} />
                    </View>
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <View style={styles.fieldData}>
                      <Text style={styles.fieldLabel}>{state.strings.enableService}</Text>
                      <Switch
                        style={styles.fieldSwitch}
                        value={state.setup?.iceService !== 'default'}
                        disabled={state.loading || !state.setup?.enableIce}
                        onValueChange={() => actions.setEnableService(state.setup?.iceService === 'default')}
                      />
                    </View>
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>{state.strings.serviceUrl}</Text>
                    <TextInput
                      style={styles.fieldInput}
                      mode="outlined"
                      outlineStyle={{borderColor: theme.colors.primary}}
                      autoCapitalize={false}
                      disabled={!state.setup?.enableIce || state.setup?.iceService !== 'default' || state.loading}
                      placeholder={state.strings.urlHint}
                      value={state.setup?.iceService === 'default' ? state.setup?.iceUrl : ''}
                      onChangeText={value => actions.setIceUrl(value)}
                    />
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>{state.strings.serviceId}</Text>
                    <TextInput
                      style={styles.fieldInput}
                      mode="outlined"
                      outlineStyle={{borderColor: theme.colors.primary}}
                      autoCapitalize={false}
                      disabled={!state.setup?.enableIce || state.loading}
                      placeholder={state.strings.idHint}
                      value={state.setup?.iceUsername}
                      onChangeText={value => actions.setIceUsername(value)}
                    />
                  </View>
                  <Divider style={styles.separator} />
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>{state.strings.serviceToken}</Text>
                    <TextInput
                      style={styles.fieldInput}
                      mode="outlined"
                      outlineStyle={{borderColor: theme.colors.primary}}
                      autoCapitalize={false}
                      disabled={!state.setup?.enableIce || state.loading}
                      placeholder={state.strings.tokenHint}
                      value={state.setup?.icePassword}
                      onChangeText={value => actions.setIcePassword(value)}
                    />
                  </View>
                </Surface>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Surface>
      <Confirm show={state.error} params={errorParams} />
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={state.confirmingMFAuth} onRequestClose={actions.cancelMFAuth}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <KeyboardAwareScrollView enableOnAndroid={true} style={styles.container} contentContainerStyle={styles.modalContent}>
            <Surface elevation={4} mode="flat" style={styles.modalSurface}>
              <Text style={styles.modalLabel}>{state.strings.mfaTitle}</Text>
              <IconButton style={styles.modalClose} icon="close" size={24} onPress={actions.cancelMFAuth} />
              <Text style={styles.modalDescription}>{state.strings.mfaSteps}</Text>
              <Image style={styles.secretImage} resizeMode={'contain'} source={{uri: state.confirmMFAuthImage}} />

              <View style={styles.secretText}>
                <Text style={styles.secret} selectable={true} adjustsFontSizeToFit={true} numberOfLines={1}>
                  {state.confirmMFAuthText}
                </Text>
                <TouchableOpacity onPress={copySecret}>
                  <Icon style={styles.secretIcon} size={18} source={secretCopy ? 'check' : 'content-copy'} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <InputCode onChangeText={actions.setMFAuthCode} />

              <View style={styles.authMessage}>
                <Text style={styles.authMessageText}>{state.mfaMessage}</Text>
              </View>

              <View style={styles.modalControls}>
                <Button mode="outlined" onPress={actions.cancelMFAuth}>
                  {state.strings.cancel}
                </Button>
                <Button mode="contained" loading={confirmingAuth} disabled={state.mfaCode.length !== 6} onPress={confirmAuth}>
                  {state.strings.mfaConfirm}
                </Button>
              </View>
            </Surface>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    </View>
  );
}
