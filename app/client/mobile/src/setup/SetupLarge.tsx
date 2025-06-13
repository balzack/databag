import React, {useState} from 'react';
import {TouchableOpacity, Modal, Image, View} from 'react-native';
import {useTheme, ActivityIndicator, Icon, Button, IconButton, RadioButton, Switch, Surface, Divider, TextInput, Text} from 'react-native-paper';
import {styles} from './Setup.styled';
import {useSetup} from './useSetup.hook';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Confirm} from '../confirm/Confirm';
import {Colors} from '../constants/Colors';
import {InputCode} from '../utils/InputCode';
import {BlurView} from '@react-native-community/blur';
import Clipboard from '@react-native-clipboard/clipboard';

export function SetupLarge() {
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
    <View style={{ width: '100%', height: '100%' }}>
      <View style={styles.setup}>
        <View style={styles.header}>
          <View style={styles.busy}>{(state.loading || state.updating) && <ActivityIndicator size={18} />}</View>
          <Text style={styles.title}>{state.strings.setup}</Text>
          <View style={styles.busy}>
            <IconButton style={styles.icon} iconColor={Colors.primary} mode="contained" icon="logout" onPress={actions.logout} />
          </View>
        </View>
        <Divider style={styles.line} bold={true} />
        <KeyboardAwareScrollView enableOnAndroid={true} style={styles.form} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.option}>
            <Text style={styles.label}>{state.strings.keyType}:</Text>
            <View style={styles.radioSelect}>
              <View style={styles.radio}>
                <Text style={styles.radioLabel}>RSA2048</Text>
                <RadioButton.Item
                  disabled={state.loading}
                  rippleColor="transparent"
                  style={styles.radioButton}
                  label=""
                  mode="android"
                  status={state.setup?.keyType === 'RSA2048' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    actions.setKeyType('RSA2048');
                  }}
                />
              </View>
              <View style={styles.radio}>
                <Text style={styles.radioLabel}>RSA4096</Text>
                <RadioButton.Item
                  disabled={state.loading}
                  rippleColor="transparent"
                  style={styles.radioButton}
                  label=""
                  mode="android"
                  status={state.setup?.keyType === 'RSA4096' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    actions.setKeyType('RSA4096');
                  }}
                />
              </View>
            </View>
          </View>
          <View style={styles.option}>
            <Text style={styles.label}>{state.strings.federatedHost}:</Text>
            <Surface mode="flat" elevation={5} style={styles.inputSurface}>
              <TextInput
                dense={true}
                style={styles.input}
                outlineColor="transparent"
                activeOutlineColor="transparent"
                autoCapitalize={false}
                underlineStyle={styles.inputUnderline}
                mode="outlined"
                disabled={state.loading}
                placeholder={state.strings.hostHint}
                value={state.setup?.domain}
                onChangeText={value => actions.setDomain(value)}
              />
            </Surface>
          </View>
          <View style={styles.option}>
            <Text style={styles.label}>{state.strings.storageLimit}:</Text>
            <Surface mode="flat" elevation={5} style={styles.inputSurface}>
              <TextInput
                type="number"
                dense={true}
                style={styles.input}
                keyboardType="numeric"
                outlineColor="transparent"
                activeOutlineColor="transparent"
                autoCapitalize={false}
                underlineStyle={styles.inputUnderline}
                mode="outlined"
                disabled={state.loading}
                placeholder={state.strings.storageHint}
                value={state.accountStorage}
                onChangeText={value => actions.setAccountStorage(value)}
              />
            </Surface>
          </View>
          <View style={styles.option}>
            <Text style={styles.label}>{state.strings.accountCreation}:</Text>
            <Switch style={styles.controlSwitch} value={state.setup?.enableOpenAccess} disabled={state.loading} onValueChange={() => actions.setEnableOpenAccess(!state.setup?.enableOpenAccess)} />
            {state.setup?.enableOpenAccess && (
              <Surface mode="flat" elevation={5} style={styles.inputSurface}>
                <TextInput
                  type="number"
                  dense={true}
                  style={styles.input}
                  keyboardType="numeric"
                  outlineColor="transparent"
                  activeOutlineColor="transparent"
                  autoCapitalize={false}
                  underlineStyle={styles.inputUnderline}
                  mode="outlined"
                  disabled={state.loading}
                  placeholder={state.strings.storageHint}
                  value={state.openAccessLimit}
                  onChangeText={value => actions.setOpenAccessLimit(value)}
                />
              </Surface>
            )}
          </View>
          <View style={styles.option}>
            <Text style={styles.label}>{state.strings.enableNotifications}:</Text>
            <Switch style={styles.controlSwitch} value={state.setup?.pushSupported} disabled={state.loading} onValueChange={() => actions.setPushSupported(!state.setup?.pushSupported)} />
          </View>
          <View style={styles.option}>
            <Text style={styles.label}>{state.strings.allowUnsealed}:</Text>
            <Switch style={styles.controlSwitch} value={state.setup?.allowUnsealed} disabled={state.loading} onValueChange={() => actions.setAllowUnsealed(!state.setup?.allowUnsealed)} />
          </View>
          <View style={styles.option}>
            <Text style={styles.label}>{state.strings.mfaTitle}:</Text>
            <Switch style={styles.controlSwitch} value={state.mfaEnabled} disabled={state.loading} onValueChange={toggleMFAuth} />
          </View>
          <Divider style={styles.divider} bold={false} />
          <View style={styles.option}>
            <Text style={styles.label}>{state.strings.enableImage}:</Text>
            <Switch style={styles.controlSwitch} value={state.setup?.enableImage} disabled={state.loading} onValueChange={() => actions.setEnableImage(!state.setup?.enableImage)} />
          </View>
          <View style={styles.option}>
            <Text style={styles.label}>{state.strings.enableAudio}:</Text>
            <Switch style={styles.controlSwitch} value={state.setup?.enableAudio} disabled={state.loading} onValueChange={() => actions.setEnableAudio(!state.setup?.enableAudio)} />
          </View>
          <View style={styles.option}>
            <Text style={styles.label}>{state.strings.enableVideo}:</Text>
            <Switch style={styles.controlSwitch} value={state.setup?.enableVideo} disabled={state.loading} onValueChange={() => actions.setEnableVideo(!state.setup?.enableVideo)} />
          </View>
          <View style={styles.option}>
            <Text style={styles.label}>{state.strings.enableBinary}:</Text>
            <Switch style={styles.controlSwitch} value={state.setup?.enableBinary} disabled={state.loading} onValueChange={() => actions.setEnableBinary(!state.setup?.enableBinary)} />
          </View>
          <Divider style={styles.divider} bold={false} />
          <View style={styles.ice}>
            <View style={styles.option}>
              <Text style={styles.label}>{state.strings.enableWeb}:</Text>
              <Switch style={styles.controlSwitch} value={state.setup?.enableIce} disabled={state.loading} onValueChange={() => actions.setEnableIce(!state.setup?.enableIce)} />
            </View>
            {state.setup?.enableIce && (
              <View style={styles.option}>
                <Text style={styles.label}>{state.strings.enableService}:</Text>
                <Switch style={styles.controlSwitch} value={state.setup?.enableService} disabled={state.loading} onValueChange={() => actions.setEnableService(!state.setup?.enableService)} />
              </View>
            )}
            {state.setup?.enableIce && state.setup?.iceService === 'cloudflare' && (
              <View style={styles.option}>
                <Text style={styles.label}>TURN_KEY_ID:</Text>
                <Surface mode="flat" elevation={5} style={styles.inputSurface}>
                  <TextInput
                    dense={true}
                    style={styles.input}
                    outlineColor="transparent"
                    activeOutlineColor="transparent"
                    autoCapitalize={false}
                    underlineStyle={styles.inputUnderline}
                    mode="outlined"
                    disabled={state.loading}
                    placeholder="ID"
                    value={state.setup?.iceUsername}
                    onChangeText={value => actions.setIceUsername(value)}
                  />
                </Surface>
              </View>
            )}
            {state.setup?.enableIce && state.setup?.iceService === 'cloudflare' && (
              <View style={styles.option}>
                <Text style={styles.label}>TURN_KEY_API_TOKEN:</Text>
                <Surface mode="flat" elevation={5} style={styles.inputSurface}>
                  <TextInput
                    dense={true}
                    style={styles.input}
                    outlineColor="transparent"
                    activeOutlineColor="transparent"
                    autoCapitalize={false}
                    underlineStyle={styles.inputUnderline}
                    mode="outlined"
                    disabled={state.loading}
                    placeholder="TOKEN"
                    value={state.setup?.icePassword}
                    onChangeText={value => actions.setIcePassword(value)}
                  />
                </Surface>
              </View>
            )}
            {state.setup?.enableIce && state.setup?.iceService === 'default' && (
              <View style={styles.option}>
                <Text style={styles.label}>{state.strings.serverUrl}:</Text>
                <Surface mode="flat" elevation={5} style={styles.inputSurface}>
                  <TextInput
                    dense={true}
                    style={styles.input}
                    outlineColor="transparent"
                    activeOutlineColor="transparent"
                    autoCapitalize={false}
                    underlineStyle={styles.inputUnderline}
                    mode="outlined"
                    disabled={state.loading}
                    placeholder={state.strings.urlHint}
                    value={state.setup?.iceUrl}
                    onChangeText={value => actions.setIceUrl(value)}
                  />
                </Surface>
              </View>
            )}
            {state.setup?.enableIce && state.setup?.iceService === 'default' && (
              <View style={styles.option}>
                <Text style={styles.label}>{state.strings.webUsername}:</Text>
                <Surface mode="flat" elevation={5} style={styles.inputSurface}>
                  <TextInput
                    dense={true}
                    style={styles.input}
                    outlineColor="transparent"
                    activeOutlineColor="transparent"
                    autoCapitalize={false}
                    underlineStyle={styles.inputUnderline}
                    mode="outlined"
                    disabled={state.loading}
                    placeholder={state.strings.username}
                    value={state.setup?.iceUsername}
                    onChangeText={value => actions.setIceUsername(value)}
                  />
                </Surface>
              </View>
            )}
            {state.setup?.enableIce && state.setup?.iceService === 'default' && (
              <View style={styles.option}>
                <Text style={styles.label}>{state.strings.webPassword}:</Text>
                <Surface mode="flat" elevation={5} style={styles.inputSurface}>
                  <TextInput
                    dense={true}
                    style={styles.input}
                    outlineColor="transparent"
                    activeOutlineColor="transparent"
                    autoCapitalize={false}
                    underlineStyle={styles.inputUnderline}
                    mode="outlined"
                    disabled={state.loading}
                    placeholder={state.strings.password}
                    value={state.setup?.icePassword}
                    onChangeText={value => actions.setIcePassword(value)}
                  />
                </Surface>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
        <Divider style={styles.line} bold={true} />
      </View>
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