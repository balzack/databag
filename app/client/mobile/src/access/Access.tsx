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
      <KeyboardAwareScrollView style={styles.frame} contentContainerStyle={styles.scroll} enableOnAndroid={true}>
        <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
          <View style={styles.form}>
            <View style={styles.header}>
              <Text variant="titleLarge">
                Databag
              </Text>
            </View>
            <View style={styles.header}>
              <Text style={styles.headline} variant="titleSmall">{ state.strings.communication }</Text>
            </View>
            <View style={styles.footer}>
              <Button mode="contained" style={styles.continue} onPress={actions.continue}>
                {state.strings.login}
              </Button>
              <View style={styles.footline}>
                <Text>{ state.strings.notUser }</Text>
                <Button mode="text" onPress={actions.continue}>
                  {state.strings.createAccount}
                </Button>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
      {state.mode === 'splash' && (
        <View style={styles.splash}>
          <Image style={styles.typer} source={typer} resizeMode="contain" />
        </View>
      )}
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
