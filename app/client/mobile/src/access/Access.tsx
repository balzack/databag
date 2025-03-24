import React, {useState} from 'react';
import {Modal, Platform, ScrollView, View, Image, SafeAreaView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAccess} from './useAccess.hook';
import {styles} from './Access.styled';
import left from '../images/login.png';
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
    <Surface style={styles.split}>
      {state.layout === 'large' && <Image style={styles.left} source={left} resizeMode="contain" />}
      <KeyboardAwareScrollView style={styles.frame} contentContainerStyle={styles.scroll} enableOnAndroid={true}>
        <SafeAreaView style={styles.right} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <View style={styles.admin} />
            <Text style={styles.label} variant="headlineLarge">
              Databag
            </Text>
            <View style={styles.admin}>
              {state.mode !== 'admin' && <IconButton style={styles.admin} icon="cog-outline" size={28} onPress={() => actions.setMode('admin')} />}
              {state.mode === 'admin' && <IconButton style={styles.admin} icon="account-outline" size={28} onPress={() => actions.setMode('account')} />}
            </View>
          </View>
          {state.mode === 'account' && (
            <View style={styles.body}>
              <Text variant="headlineSmall">{state.strings.accountLogin}</Text>
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={Platform.OS === 'ios' ? state.strings.server : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.server : undefined}
                value={state.node}
                left={<TextInput.Icon style={styles.icon} icon="server" />}
                onChangeText={value => actions.setNode(value)}
              />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={Platform.OS === 'ios' ? state.strings.username : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.username : undefined}
                value={state.username}
                left={<TextInput.Icon style={styles.icon} icon="account" />}
                onChangeText={value => actions.setUsername(value)}
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
              <Button mode="text" onPress={() => actions.setMode('create')}>
                {state.strings.createAccount}
              </Button>
              <Button mode="text" onPress={() => actions.setMode('reset')}>
                {state.strings.forgotPassword}
              </Button>
            </View>
          )}
          {state.mode === 'reset' && (
            <View style={styles.body}>
              <Text variant="headlineSmall">{state.strings.accessAccount}</Text>
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={Platform.OS === 'ios' ? state.strings.token : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.token : undefined}
                left={<TextInput.Icon style={styles.icon} icon="ticket-account" />}
                onChangeText={value => actions.setToken(value)}
              />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={Platform.OS === 'ios' ? state.strings.server : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.server : undefined}
                value={state.node}
                left={<TextInput.Icon style={styles.icon} icon="server" />}
                onChangeText={value => actions.setNode(value)}
              />
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
              <Button mode="contained" style={styles.submit} onPress={login} loading={state.loading} disabled={!state.token || !state.node || !accept}>
                {state.strings.access}
              </Button>
              <Button mode="text" onPress={() => actions.setMode('create')}>
                {state.strings.createAccount}
              </Button>
              <Button mode="text" onPress={() => actions.setMode('account')}>
                {state.strings.accountLogin}
              </Button>
            </View>
          )}
          {state.mode === 'create' && (
            <View style={styles.body}>
              <Text variant="headlineSmall">{state.strings.createAccount}</Text>
              <View style={styles.spacer}>
                {!state.available && (
                  <TextInput
                    style={styles.input}
                    mode="flat"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    label={Platform.OS === 'ios' ? state.strings.token : undefined}
                    placeholder={Platform.OS !== 'ios' ? state.strings.token : undefined}
                    left={<TextInput.Icon style={styles.icon} icon="ticket-account" />}
                    onChangeText={value => actions.setToken(value)}
                  />
                )}
              </View>
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={Platform.OS === 'ios' ? state.strings.server : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.server : undefined}
                value={state.node}
                left={<TextInput.Icon style={styles.icon} icon="server" />}
                onChangeText={value => actions.setNode(value)}
              />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                error={state.taken}
                label={Platform.OS === 'ios' ? state.strings.username : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.username : undefined}
                value={state.username}
                left={<TextInput.Icon style={styles.icon} icon="account" />}
                onChangeText={value => actions.setUsername(value)}
              />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                textContentType={'oneTimeCode'}
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
                textContentType={'oneTimeCode'}
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
              <Button
                mode="contained"
                style={styles.submit}
                onPress={login}
                loading={state.loading}
                disabled={!state.username || !state.password || state.password !== state.confirm || !state.node || !accept}>
                {state.strings.create}
              </Button>
              <Button mode="text" onPress={() => actions.setMode('account')}>
                {state.strings.accountLogin}
              </Button>
              <Button mode="text" onPress={() => actions.setMode('reset')}>
                {state.strings.forgotPassword}
              </Button>
            </View>
          )}
          {state.mode === 'admin' && (
            <View style={styles.body}>
              <Text variant="headlineSmall">{state.strings.admin}</Text>
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={Platform.OS === 'ios' ? state.strings.server : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.server : undefined}
                value={state.node}
                left={<TextInput.Icon style={styles.icon} icon="server" />}
                onChangeText={value => actions.setNode(value)}
              />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={Platform.OS === 'ios' ? state.strings.password : undefined}
                placeholder={Platform.OS !== 'ios' ? state.strings.password : undefined}
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
              <Button mode="contained" style={styles.submit} onPress={login} loading={state.loading} disabled={!state.password || !state.node || !accept}>
                {state.strings.login}
              </Button>
            </View>
          )}
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
