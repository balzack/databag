import React, {useState} from 'react';
import {View, Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAccess} from './useAccess.hook';
import {styles} from './Access.styled';
import left from '../images/login.png';
import {IconButton, Modal, Surface, Text, TextInput, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import {InputCode} from '../utils/InputCode';

export function Access() {
  const {state, actions} = useAccess();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(false);
  const [otp, setOtp] = useState(false);

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
                label={state.strings.server}
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
                label={state.strings.username}
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
                label={state.strings.password}
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
              { (!state.username || !state.password || !state.node) && (
                <Button mode="contained" style={styles.submit} disabled={true}>
                  {state.strings.login}
                </Button>
              )}
              { state.username && state.password && state.node && (
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
                label={state.strings.token}
                left={<TextInput.Icon style={styles.icon} icon="ticket-account" />}
                onChangeText={value => actions.setToken(value)}
              />
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={state.strings.server}
                value={state.node}
                left={<TextInput.Icon style={styles.icon} icon="server" />}
                onChangeText={value => actions.setNode(value)}
              />
              <Button mode="contained" style={styles.submit} onPress={login} loading={state.loading} disabled={!state.token || !state.node}>
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
                    label={state.strings.token}
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
                label={state.strings.server}
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
                label={state.strings.username}
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
                label={state.strings.password}
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
                label={state.strings.confirmPassword}
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
              <Button mode="contained" style={styles.submit} onPress={login} loading={state.loading} disabled={!state.username || !state.password || state.password !== state.confirm || !state.node}>
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
              <Text variant="headlineSmall">{state.strings.adminAccess}</Text>
              <TextInput
                style={styles.input}
                mode="flat"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={state.strings.server}
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
                label="Password"
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
              <Button mode="contained" style={styles.submit} onPress={login} loading={state.loading} disabled={!state.password || !state.node}>
                {state.strings.login}
              </Button>
            </View>
          )}
        </SafeAreaView>
      </KeyboardAwareScrollView>
      {(alert || otp) && <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />}
      <Modal visible={alert} onDismiss={() => setAlert(false)} contentContainerStyle={styles.modal}>
        <Surface elevation={5} mode="flat" style={styles.content}>
          <Text variant="titleLarge">{state.strings.operationFailed}</Text>
          <Text variant="titleSmall">{state.strings.tryAgain}</Text>
          <Button mode="text" style={styles.close} onPress={() => setAlert(false)}>
            {state.strings.close}
          </Button>
        </Surface>
      </Modal>
      <Modal visible={otp} onDismiss={() => setOtp(false)} contentContainerStyle={styles.modal}>
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
      </Modal>
    </Surface>
  );
}
