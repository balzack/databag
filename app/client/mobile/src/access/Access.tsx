import React, {useState} from 'react';
import {Modal, Platform, ScrollView, View, Image, SafeAreaView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAccess} from './useAccess.hook';
import {styles} from './Access.styled';
import left from '../images/login.png';
import typer from '../images/typer.png';
import {IconButton, Divider, Surface, Text, TextInput, Button, Checkbox} from 'react-native-paper';
import {BlurView} from '@react-native-community/blur';
import {InputCode} from '../utils/InputCode';
import {tos} from '../constants/terms';
import {Confirm} from '../confirm/Confirm';

export function Access() {
  const {state, actions} = useAccess();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accept, setAccept] = useState(false);
  const [alert, setAlert] = useState(false);
  const [otp, setOtp] = useState(false);
  const [terms, setTerms] = useState(false);

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

  const login = async () => {
    if (!state.loading) {
      actions.setLoading(true);
      try {
        if (state.mode === 'account') {
          await actions.accountLogin();
        } else if (state.mode === 'create') {
          await actions.accountCreate();
        } else if (state.mode === 'reset') {
          await actions.accountAccess();
        } else if (state.mode === 'admin') {
          await actions.adminLogin();
        }
        setOtp(false);
      } catch (err) {
        console.log(err.message);
        if (err.message === '405' || err.message === '403' || err.message === '429') {
          setOtp(true);
        } else {
          setAlert(true);
        }
      }
      actions.setLoading(false);
    }
  };

  return (
    <Surface style={styles.full} elevation={9}>
      {state.mode === 'splash' && (
        <View style={styles.splash}>
          <Image style={styles.typer} source={typer} resizeMode="contain" />
        </View>
      )}
      <KeyboardAwareScrollView style={styles.frame} contentContainerStyle={styles.scroll} enableOnAndroid={true}>
        <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
          <View style={styles.form}>
            <View style={styles.header}>
              <Text variant="titleLarge">
                Databag
              </Text>
            </View>
            { state.mode === 'splash' && (
              <View style={styles.header}>
                <Text style={styles.headline} variant="titleSmall">{ state.strings.communication }</Text>
              </View>
            )}
            { state.mode === 'splash' && (
              <View style={styles.footer}>
                <Button mode="contained" style={styles.submit} onPress={() => actions.continue(false)}>
                  {state.strings.login}
                </Button>
                <View style={styles.footline}>
                  <Text variant="bodySmall">{ state.strings.notUser }</Text>
                  <Button mode="text" onPress={() => actions.continue(true)}>
                    {state.strings.createAccount}
                  </Button>
                </View>
              </View>
            )}
            {state.mode === 'account' && (
              <View style={styles.blocks}>
                <Text variant="headlineSmall">{state.strings.login}</Text>
                <View style={styles.block}>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    placeholder={state.strings.server}
                    value={state.node}
                    left={<TextInput.Icon style={styles.icon} icon="server" />}
                    onChangeText={value => actions.setNode(value)}
                  />
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    placeholder={state.strings.username}
                    value={state.username}
                    left={<TextInput.Icon style={styles.icon} icon="account" />}
                    onChangeText={value => actions.setUsername(value)}
                  />
                  <TextInput
                    style={styles.input}
                    mode="outlined"
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
                </View>
                <View style={styles.block}>
                  <Button style={styles.terms} mode="text" onPress={() => setTerms(true)}>
                    {state.strings.viewTerms}
                  </Button>
                  <View style={styles.accept}>
                    <Checkbox.Android
                      status={accept ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setAccept(!accept);
                      }}
                    />
                    <Text>{state.strings.acceptTerms}</Text>
                  </View>
                </View>
                {(!state.username || !state.password || !state.node || !accept) && (
                  <Button mode="contained" style={styles.submit} disabled={true}>
                    {state.strings.login}
                  </Button>
                )}
                {state.username && state.password && state.node && accept && (
                  <Button mode="contained" style={styles.submit} onPress={login} loading={state.loading}>
                    {state.strings.login}
                  </Button>
                )}
                <View style={styles.block}>
                  <View style={styles.footline}>
                    <Text>{ state.strings.notUser }</Text>
                    <Button mode="text" onPress={() => actions.setMode('create')}>
                      {state.strings.createAccount}
                    </Button>
                  </View>
                  <Button mode="text" onPress={() => actions.setMode('reset')}>
                    {state.strings.forgotPassword}
                  </Button>
                </View>
                <View style={styles.footer}>
                  <View style={styles.footline}>
                    <IconButton style={styles.admin} icon="cog-outline" size={28} onPress={() => actions.setMode('account')} />
                    <Button mode="text" onPress={() => actions.setMode('admin')}>
                      {state.strings.admin}
                    </Button>
                  </View>
                </View>
              </View>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={otp} onRequestClose={() => setOtp(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <Surface elevation={5} mode="flat" style={styles.content}>
            <Text variant="titleLarge">{state.strings.mfaTitle}</Text>
            <Text variant="titleSmall">{state.strings.mfaEnter}</Text>
            <InputCode onChangeText={actions.setCode} />
            <View style={styles.controls}>
              <Button mode="outlined" style={styles.submit} onPress={() => setOtp(false)}>
                {state.strings.cancel}
              </Button>
              <Button mode="contained" style={styles.submit} onPress={login} loading={state.loading} disabled={state.code.length !== 6}>
                {state.strings.login}
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={terms} onRequestClose={() => setTerms(false)}>
        <View style={styles.modal}>
          <Surface elevation={1} mode="flat" style={styles.modalSurface}>
            <SafeAreaView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{state.strings.terms}</Text>
                <IconButton style={styles.modalClose} icon="close" size={24} onPress={() => setTerms(false)} />
              </View>
              <Divider style={styles.line} />
              <ScrollView style={styles.frame}>
                <Text numberOfLines={0} style={styles.legal}>
                  {tos[state.strings.code]}
                </Text>
              </ScrollView>
              <Divider style={styles.line} />
            </SafeAreaView>
          </Surface>
        </View>
      </Modal>
      <Confirm show={alert} params={alertParams} />
    </Surface>
  );
}
