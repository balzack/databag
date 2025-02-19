import React from 'react';
import {SafeAreaView, Image, View, Pressable} from 'react-native';
import {ActivityIndicator, RadioButton, Switch, Surface, Divider, TextInput, Text} from 'react-native-paper';
import {styles} from './Setup.styled';
import {useSetup} from './useSetup.hook';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Confirm } from '../confirm/Confirm';

export function Setup() {
  const { state, actions } = useSetup();

  const errorParams = {
    title: state.strings.operationFailed, 
    prompt: state.strings.tryAgain,
    cancel: {
      label: state.strings.close,
      action: actions.clearError,
    },      
  };

console.log(state.setup);

  return (
    <View style={styles.setup}>
      <View style={styles.header}>
        <View style={styles.busy}>
          { state.loading && (
            <ActivityIndicator size={18} />
          )}
        </View>
        <Text style={styles.title}>{ state.strings.setup }</Text>
        <View style={styles.busy}>
          { state.updating && (
            <ActivityIndicator size={18} />
          )}
        </View>
      </View>
      <Divider style={styles.line} bold={true} />
      <KeyboardAwareScrollView enableOnAndroid={true} style={styles.form} contentContainerStyle={styles.content}>
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
                status={state.setup?.keyType === 'RSA_2048' ? 'checked' : 'unchecked'}
                onPress={() => { actions.setKeyType('RSA_2048') }}
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
                status={state.setup?.keyType === 'RSA_4096' ? 'checked' : 'unchecked'}
                onPress={() => { actions.setKeyType('RSA_4096') }}
              />
            </View>
          </View>
        </View>
        <View style={styles.option}>
          <Text style={styles.label}>{ state.strings.federatedHost }:</Text>
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
          <Text style={styles.label}>{ state.strings.storageLimit }:</Text>
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
          <Switch style={styles.controlSwitch} value={state.setup?.enableOpenAccess} disabled={state.loading} onValueChange={()=>actions.setEnableOpenAccess(!state.setup?.enableOpenAccess)} />
          { state.setup?.enableOpenAccess && (
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
          <Switch style={styles.controlSwitch} value={state.setup?.pushSupported} disabled={state.loading} onValueChange={()=>actions.setPushSupported(!state.setup?.pushSupported)} />
        </View>
        <View style={styles.option}>
          <Text style={styles.label}>{state.strings.allowUnsealed}:</Text>
          <Switch style={styles.controlSwitch} value={state.setup?.allowUnsealed} disabled={state.loading} onValueChange={()=>actions.setAllowUnsealed(!state.setup?.allowUnsealed)} />
        </View>
        <Divider style={styles.divider} bold={false} />
      </KeyboardAwareScrollView>
      <Divider style={styles.line} bold={true} />
      <Confirm show={state.error} params={errorParams} />
    </View>
  );
}

