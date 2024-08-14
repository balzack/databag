import React, { useState } from 'react'
import { View, Image } from 'react-native';
import { useAccess } from './useAccess.hook'
import { styles } from './Access.styled'
import left from '../images/login.png'
import { IconButton, Text } from 'react-native-paper';

export function Access() {
  const { state, actions } = useAccess()
  const [disabled, setDisabled] = useState(false)

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
        otpClose()
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
          otpOpen()
        } else {
          alertOpen()
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
      <View style={styles.right}>
        <View style={styles.frame}>
          {state.mode !== 'admin' && (
            <IconButton icon="camera" size={20}
            />
          )}
          {state.mode === 'admin' && (
            <IconButton icon="camera" size={20}
            />
          )}
          <Text variant="headlineLarge">Databag</Text>
        </View>
      </View>
    </View>
  )
}
