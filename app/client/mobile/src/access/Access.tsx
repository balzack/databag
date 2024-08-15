import React, { useState } from 'react'
import { ScrollView, View, Image } from 'react-native';
import { useAccess } from './useAccess.hook'
import { styles } from './Access.styled'
import left from '../images/login.png'
import { IconButton, Text, TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Access() {
  const [ text, setText ] = useState('');
  const { state, actions } = useAccess()
  const [disabled, setDisabled] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    if (!state.loading) {
      actions.setLoading(true)
      try {
        if (state.mode === 'account') {
          await actions.accountLogin()
        } else if (state.mode === 'create') {
          await actions.accountCreate()
        } else if (state.mode === 'reset') {
          await actions.accountAccess()
        } else if (state.mode === 'admin') {
          await actions.adminLogin()
        }
        console.log("OTP CLOSE");
      } catch (err) {
        console.log(err.message)
        if (
          err.message === '405' ||
          err.message === '403' ||
          err.message === '429'
        ) {
          if (err.message === '429') {
            setDisabled(true)
          } else {
            setDisabled(false)
          }
          console.log("DONE LOGIN");
        } else {
          console.log("ALERT ERROR");
        }
      }
      actions.setLoading(false)
    }
  }

  return (
    <View style={styles.split}>
      {state.wide && (
        <Image style={styles.left} source={left} resizeMode="contain" />
      )}
      <SafeAreaView style={styles.right} edges={['top', 'bottom']}>
        <ScrollView style={styles.frame} contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <View style={styles.admin} />
            <Text style={styles.label} variant="headlineLarge">Databag</Text>
            <View style={styles.admin}>
              {state.mode !== 'admin' && (
                <IconButton style={styles.admin} icon="cog-outline" size={28}
                  onPress={() => actions.setMode('admin')}
                />
              )}
              {state.mode === 'admin' && (
                <IconButton style={styles.admin} icon="account-outline" size={28}
                  onPress={() => actions.setMode('account')}
                />
              )}
            </View>
          </View>
          {state.mode === 'account' && (
            <View style={styles.body}>
              <Text variant="headlineSmall">{state.strings.accountLogin}</Text>
              <TextInput
                style={styles.input}
                mode="outlined"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={state.strings.server}
                value={state.node}
                left={<TextInput.Icon icon="server" />}
                onChangeText={value => actions.setNode(value)}
              />
              <TextInput
                style={styles.input}
                mode="outlined"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label={state.strings.username}
                value={state.username}
                left={<TextInput.Icon icon="account" />}
                onChangeText={value => actions.setUsername(value)}
              />
              <TextInput
                style={styles.input}
                mode="outlined"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                label="Password"
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock" />}
                right={showPassword ? <TextInput.Icon icon="eye-off" onPress={() => setShowPassword(false)} /> : <TextInput.Icon icon="eye" onPress={() => setShowPassword(true)} />}
                onChangeText={value => actions.setPassword(value)}
              />
              <Button
                mode="contained"
                style={styles.submit}
                onPress={login}
                loading={state.loading}
                disabled={!state.username || !state.password || !state.node}
              >
                {state.strings.login}
              </Button>

                <Button
                  mode="text"
                  onPress={() => actions.setMode('create')}
                >
                  {state.strings.createAccount}
                </Button>
                <Button
                  mode="text"
                  onPress={() => actions.setMode('reset')}
                >
                  {state.strings.forgotPassword}
                </Button>


            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}