import React, {useState} from 'react';
import {useAnimatedValue, Platform, Animated, Modal, ScrollView, View, Image, SafeAreaView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAccess} from './useAccess.hook';
import {styles} from './Access.styled';
import typer from '../images/typer.png';
import {IconButton, Divider, Surface, Text, TextInput, Button, Checkbox, useTheme} from 'react-native-paper';
import {BlurView} from '@react-native-community/blur';
import {InputCode} from '../utils/InputCode';
import {tos} from '../constants/terms';
import {Confirm} from '../confirm/Confirm';

export function Access() {
  const {state, actions} = useAccess();
  const [showPassword, setShowPassword] = useState(false);
  const [accept, setAccept] = useState(false);
  const [alert, setAlert] = useState(false);
  const [otp, setOtp] = useState(false);
  const [terms, setTerms] = useState(false);
  const theme = useTheme();
  const switching = useAnimatedValue(1);

  const fadeIn = (mode: string) => {
    actions.setMode(mode);
    Animated.timing(switching, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const begin = (create: boolean) => {
    actions.requestPermission();
    fadeOut(create ? 'create' : 'account');
  };

  const fadeOut = (mode: string) => {
    if (Platform.OS === 'ios') {
      Animated.timing(switching, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => fadeIn(mode));
    } else {
      actions.setMode(mode);
    }
  };

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
          console.log(err);
          setAlert(true);
        }
      }
      actions.setLoading(false);
    }
  };

  return (
    <Surface style={styles.full} elevation={9}>
      {state.mode === 'splash' && (
        <Animated.View style={[styles.splash, {opacity: switching}]}>
          <Image style={styles.typer} source={typer} resizeMode="contain" />
        </Animated.View>
      )}
      <KeyboardAwareScrollView style={styles.frame} contentContainerStyle={styles.scroll} enableOnAndroid={true}>
        <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
          <View style={styles.form}>
            <View style={styles.header}>
              <Text variant="titleLarge">Databag</Text>
            </View>
            {state.mode === 'splash' && (
              <Animated.View style={[styles.header, {opacity: switching}]}>
                <Text style={styles.headline} variant="titleSmall">
                  {state.strings.communication}
                </Text>
              </Animated.View>
            )}
            {state.mode === 'splash' && (
              <Animated.View style={[styles.start, {opacity: switching}]}>
                <Button mode="contained" textColor="white" style={styles.submit} contentStyle={styles.submitContent} onPress={() => begin(false)}>
                  {state.strings.login}
                </Button>
                <View style={styles.linkline}>
                  <Text>{state.strings.notUser}</Text>
                  <Button labelStyle={styles.textButton} compact="true" mode="text" onPress={() => begin(true)}>
                    {state.strings.createAccount}
                  </Button>
                </View>
              </Animated.View>
            )}
            {state.mode === 'admin' && (
              <Animated.View style={[styles.blocks, {opacity: switching}]}>
                <Text variant="headlineSmall">{state.strings.adminAccess}</Text>
                <View style={styles.block}>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    outlineStyle={styles.inputBorder}
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
                    outlineStyle={styles.inputBorder}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    placeholder={state.strings.password}
                    value={state.password}
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
                <Button mode="contained" style={styles.submit} disabled={!state.password || !state.node} textColor="white" onPress={login} loading={state.loading}>
                  {state.strings.access}
                </Button>
                <View style={styles.footer}>
                  <View style={styles.footline}>
                    <IconButton style={styles.admin} icon="account-circle-outline" size={24} onPress={() => fadeOut('account')} />
                    <Button mode="text" compact="true" onPress={() => fadeOut('account')}>
                      <Text variant="labelLarge">{state.strings.accounts}</Text>
                    </Button>
                  </View>
                </View>
              </Animated.View>
            )}
            {state.mode === 'reset' && (
              <Animated.View style={[styles.blocks, {opacity: switching}]}>
                <Text variant="headlineSmall">{state.strings.accessAccount}</Text>
                <View style={styles.block}>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    outlineStyle={styles.inputBorder}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    placeholder={state.strings.token}
                    value={state.token}
                    left={<TextInput.Icon style={styles.icon} icon="ticket-outline" />}
                    onChangeText={value => actions.setToken(value)}
                  />
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    outlineStyle={styles.inputBorder}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    placeholder={state.strings.server}
                    value={state.node}
                    left={<TextInput.Icon style={styles.icon} icon="server" />}
                    onChangeText={value => actions.setNode(value)}
                  />
                </View>
                <Button mode="contained" style={styles.submit} disabled={!state.token || !state.node} onPress={login} loading={state.loading}>
                  {state.strings.access}
                </Button>
                <Button mode="text" onPress={() => fadeOut('account')}>
                  {state.strings.accountLogin}
                </Button>
                <View style={styles.footer}>
                  <View style={styles.footline}>
                    <IconButton style={styles.admin} icon="settings" size={24} onPress={() => fadeOut('admin')} />
                    <Button mode="text" compact="true" onPress={() => fadeOut('admin')}>
                      <Text variant="labelLarge">{state.strings.admin}</Text>
                    </Button>
                  </View>
                </View>
              </Animated.View>
            )}
            {state.mode === 'create' && (
              <Animated.View style={[styles.blocks, {opacity: switching}]}>
                <Text variant="headlineSmall">{state.strings.createAccount}</Text>
                <View style={styles.block}>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    outlineStyle={styles.inputBorder}
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
                    outlineStyle={styles.inputBorder}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    placeholder={state.strings.username}
                    value={state.username}
                    left={<TextInput.Icon style={styles.icon} icon="user" />}
                    right={state.taken ? <TextInput.Icon style={styles.icon} color={theme.colors.offsync} icon="warning" /> : <></>}
                    onChangeText={value => actions.setUsername(value)}
                  />
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    outlineStyle={styles.inputBorder}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    textContentType={'oneTimeCode'}
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
                  <View style={styles.spacer}>
                    {!state.available && (
                      <TextInput
                        style={styles.input}
                        mode="outlined"
                        outlineStyle={styles.inputBorder}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        placeholder={state.strings.tokenRequired}
                        left={<TextInput.Icon style={styles.icon} icon="ticket-outline" />}
                        onChangeText={value => actions.setToken(value)}
                      />
                    )}
                  </View>
                </View>
                <Button mode="contained" style={styles.submit} textColor="white" disabled={!state.username || !state.password || !state.node} onPress={login} loading={state.loading}>
                  {state.strings.create}
                </Button>
                <Button mode="text" onPress={() => fadeOut('account')}>
                  {state.strings.accountLogin}
                </Button>
                <View style={styles.footer}>
                  <View style={styles.footline}>
                    <IconButton style={styles.admin} icon="settings" size={24} onPress={() => fadeOut('admin')} />
                    <Button mode="text" compact="true" onPress={() => fadeOut('admin')}>
                      <Text variant="labelLarge">{state.strings.admin}</Text>
                    </Button>
                  </View>
                </View>
              </Animated.View>
            )}
            {state.mode === 'account' && (
              <Animated.View style={[styles.blocks, {opacity: switching}]}>
                <Text variant="headlineSmall">{state.strings.login}</Text>
                <View style={styles.block}>
                  <TextInput
                    style={styles.input}
                    mode="outlined"
                    autoCapitalize="none"
                    outlineStyle={styles.inputBorder}
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
                    outlineStyle={styles.inputBorder}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    placeholder={state.strings.username}
                    value={state.username}
                    left={<TextInput.Icon style={styles.icon} icon="user" />}
                    onChangeText={value => actions.setUsername(value)}
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
                </View>
                <Button mode="contained" style={styles.submit} textColor="white" disabled={!state.username || !state.password || !state.node} onPress={login} loading={state.loading}>
                  {state.strings.login}
                </Button>
                <View style={styles.linkline}>
                  <Text>{state.strings.notUser}</Text>
                  <Button labelStyle={styles.textButton} compact="true" mode="text" onPress={() => fadeOut('create')}>
                    {state.strings.createAccount}
                  </Button>
                </View>
                <Button mode="text" onPress={() => fadeOut('reset')}>
                  {state.strings.forgotPassword}
                </Button>
                <View style={styles.footer}>
                  <View style={styles.footline}>
                    <IconButton style={styles.admin} icon="settings" size={24} onPress={() => fadeOut('admin')} />
                    <Button mode="text" compact="true" onPress={() => fadeOut('admin')}>
                      <Text variant="labelLarge">{state.strings.admin}</Text>
                    </Button>
                  </View>
                </View>
              </Animated.View>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={otp} onRequestClose={() => setOtp(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <Surface elevation={5} mode="flat" style={styles.content}>
            <Text style={styles.mfaModal}>{state.strings.mfaTitle}</Text>
            <Text>{state.strings.mfaEnter}</Text>
            <InputCode onChangeText={actions.setCode} />
            <View style={styles.controls}>
              <Button mode="outlined" style={styles.button} onPress={() => setOtp(false)}>
                {state.strings.cancel}
              </Button>
              <Button mode="contained" style={styles.button} onPress={login} loading={state.loading} disabled={state.code.length !== 6}>
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
